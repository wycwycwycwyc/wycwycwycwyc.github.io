(function () {
    const SOUND_KEY = 'soundlocalstorage';
    const ENABLED_KEY = 'soundEnabled';
    const SELECTED_KEY = 'selectedSound';
    const DEFAULT_SOUND = 'standard';

    function safeParseJSON(value, fallback) {
        if (!value) return fallback;
        try {
            return JSON.parse(value);
        } catch (error) {
            console.warn('音效配置解析失败，已回退到默认值：', error);
            return fallback;
        }
    }

    const SoundSystem = {
        library: {},
        state: {
            enabled: false,
            selectedSound: DEFAULT_SOUND
        },
        audioContext: null,
        observer: null,

        getAudioContext() {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) {
                console.warn('当前浏览器不支持 Web Audio API，音效系统已禁用');
                return null;
            }

            if (!this.audioContext) {
                this.audioContext = new AudioContextClass();
            }

            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            return this.audioContext;
        },

        loadSettings() {
            // 关键修复：iframe 中直接使用默认值，不读写 localStorage
            if (window.self !== window.top) {
                console.log('[SoundSystem] iframe 中跳过 localStorage 读取，使用默认值');
                this.state.enabled = false;
                this.state.selectedSound = DEFAULT_SOUND;
                return;
            }

            const saved = safeParseJSON(localStorage.getItem(SOUND_KEY), null);
            
            const enabled = (saved && saved.enabled === true) 
                || localStorage.getItem(ENABLED_KEY) === 'true';
            
            const selected = (saved && saved.selectedSound) 
                || localStorage.getItem(SELECTED_KEY) 
                || DEFAULT_SOUND;

            this.state.enabled = Boolean(enabled);
            this.state.selectedSound = selected;
            
            if (localStorage.getItem(SOUND_KEY) !== null 
                || localStorage.getItem(ENABLED_KEY) !== null 
                || localStorage.getItem(SELECTED_KEY) !== null) {
                this.saveSettings();
            }
        },

        saveSettings() {
            // 关键修复：iframe 中不写入 localStorage
            if (window.self !== window.top) {
                console.log('[SoundSystem] iframe 中跳过 saveSettings');
                return;
            }

            const payload = {
                enabled: Boolean(this.state.enabled),
                selectedSound: this.state.selectedSound,
                library: this.library
            };

            localStorage.setItem(SOUND_KEY, JSON.stringify(payload));
            localStorage.setItem(ENABLED_KEY, String(payload.enabled));
            localStorage.setItem(SELECTED_KEY, payload.selectedSound);
        },

        async loadLibrary() {
            try {
                const response = await fetch('/config/sounds.json', { cache: 'no-store' });
                if (!response.ok) {
                    throw new Error('音效配置文件加载失败');
                }

                const data = await response.json();
                this.library = data || {};
                if (!this.library[this.state.selectedSound]) {
                    this.state.selectedSound = DEFAULT_SOUND;
                }
                
                if (localStorage.getItem(SOUND_KEY) !== null 
                    || localStorage.getItem(ENABLED_KEY) !== null 
                    || localStorage.getItem(SELECTED_KEY) !== null) {
                    this.saveSettings();
                }
                
                return this.library;
            } catch (error) {
                console.error('读取 sounds.json 失败:', error);
                this.library = {
                    standard: {
                        label: '标准点击',
                        impacts: [
                            { duration: 0.008, frequency: 3800, q: 3, gain: 0.18, delay: 0 },
                            { duration: 0.004, frequency: 6000, q: 2, gain: 0.065, delay: 0 }
                        ],
                        bodies: [
                            { type: 'sine', duration: 0.03, frequency: 500, gain: 0.08, delay: 0.003 },
                            { type: 'sine', duration: 0.05, frequency: 250, gain: 0.048, delay: 0.005 }
                        ]
                    }
                };
                this.state.selectedSound = DEFAULT_SOUND;
                
                if (localStorage.getItem(SOUND_KEY) !== null 
                    || localStorage.getItem(ENABLED_KEY) !== null 
                    || localStorage.getItem(SELECTED_KEY) !== null) {
                    this.saveSettings();
                }
                
                return this.library;
            }
        },

        updateSettings(options) {
            const nextEnabled = options && options.enabled !== undefined ? options.enabled : this.state.enabled;
            const nextSelectedSound = options && options.selectedSound ? options.selectedSound : this.state.selectedSound;

            this.state.enabled = Boolean(nextEnabled);
            this.state.selectedSound = this.library[nextSelectedSound] ? nextSelectedSound : DEFAULT_SOUND;
            
            this.saveSettings();
            this.applySettingsToControls();
            return this.state;
        },

        applySettingsToControls() {
            const toggle = document.getElementById('soundToggle');
            const select = document.getElementById('soundSelect');

            if (toggle) {
                toggle.checked = this.state.enabled;
            }

            if (select) {
                const options = Array.from(select.options || []);
                const hasSelected = options.some(function (option) {
                    return option.value === this.state.selectedSound;
                }, this);
                if (!hasSelected) {
                    this.populateSoundSelector(select);
                }
                select.value = this.state.selectedSound;
            }
        },

        populateSoundSelector(selectElement) {
            if (!selectElement) return;
            const names = Object.keys(this.library || {});
            selectElement.innerHTML = names.map(function (name) {
                const label = this.library[name] && this.library[name].label ? this.library[name].label : name;
                return '<option value="' + name + '">' + label + '</option>';
            }, this).join('');
            const fallback = this.state.selectedSound && this.library[this.state.selectedSound] ? this.state.selectedSound : DEFAULT_SOUND;
            selectElement.value = fallback;
        },

        bindSettingsControls() {
            const toggle = document.getElementById('soundToggle');
            const select = document.getElementById('soundSelect');
            const testButton = document.getElementById('soundTestBtn');

            if (toggle) {
                toggle.addEventListener('change', function (event) {
                    SoundSystem.updateSettings({ enabled: event.target.checked });
                });
            }

            if (select) {
                this.populateSoundSelector(select);
                select.addEventListener('change', function (event) {
                    SoundSystem.updateSettings({ selectedSound: event.target.value });
                });
            }

            if (testButton) {
                testButton.addEventListener('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    SoundSystem.playSelectedSound();
                });
            }
        },

        handleClick(event) {
            if (event.defaultPrevented) return;
            const target = event.target;
            if (!target) return;

            if (target.closest && target.closest('[data-sound-ignore="true"]')) {
                return;
            }

            if (!this.state.enabled) {
                return;
            }

            this.schedulePlayback();
        },

        handleSelectChange(event) {
            if (event.defaultPrevented) return;
            const target = event.target;
            if (!target) return;

            if (target.closest && target.closest('[data-sound-ignore="true"]')) {
                return;
            }

            if (!this.state.enabled) {
                return;
            }

            this.schedulePlayback();
        },

        schedulePlayback() {
            const soundName = this.state.selectedSound || DEFAULT_SOUND;
            if (!this.library[soundName]) return;

            try {
                this.playSoundByName(soundName);
            } catch (error) {
                console.warn('音效播放失败，延后重试:', error);
                requestAnimationFrame(() => {
                    try {
                        this.playSoundByName(soundName);
                    } catch (retryError) {
                        console.warn('音效重试失败:', retryError);
                    }
                });
            }
        },

        getInteractiveSelector() {
            return [
                'button:not([data-sound-ignore="true"])',
                'input[type="button"]:not([data-sound-ignore="true"])',
                'input[type="submit"]:not([data-sound-ignore="true"])',
                'a[href]:not([data-sound-ignore="true"])',
                'label:not([data-sound-ignore="true"])',
                '[role="button"]:not([data-sound-ignore="true"])',
                '[data-sound]:not([data-sound-ignore="true"])',
                'select:not([data-sound-ignore="true"])'
            ].join(', ');
        },

        scanInteractiveElements() {
            const selector = this.getInteractiveSelector();
            const elements = document.querySelectorAll(selector);

            elements.forEach(function (element) {
                if (element.dataset.soundBoundClick !== 'true') {
                    element.dataset.soundBoundClick = 'true';
                    element.addEventListener('click', function (event) {
                        SoundSystem.handleClick(event);
                    }, true);
                }

                if (element.tagName === 'SELECT' && element.dataset.soundBoundChange !== 'true') {
                    element.dataset.soundBoundChange = 'true';
                    element.addEventListener('change', function (event) {
                        SoundSystem.handleSelectChange(event);
                    }, true);
                }
            });
        },

        observeInteractiveElements() {
            if (this.observer) {
                return;
            }

            this.observer = new MutationObserver(function () {
                SoundSystem.scanInteractiveElements();
            });

            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        },

        getSelectedSoundDefinition() {
            const soundName = this.state.selectedSound || DEFAULT_SOUND;
            return this.library[soundName] || this.library[DEFAULT_SOUND] || null;
        },

        playSelectedSound() {
            const soundName = this.state.selectedSound || DEFAULT_SOUND;
            return this.playSoundByName(soundName);
        },

        playSoundByName(soundName) {
            if (!this.state.enabled) return false;

            const context = this.getAudioContext();
            if (!context) return false;

            const definition = this.library[soundName] || this.library[DEFAULT_SOUND];
            if (!definition) return false;

            const startTime = context.currentTime;

            (definition.impacts || []).forEach(function (layer) {
                SoundSystem.playImpactLayer(context, layer, startTime);
            });

            (definition.bodies || []).forEach(function (layer) {
                SoundSystem.playBodyLayer(context, layer, startTime);
            });

            return true;
        },

        playImpactLayer(context, layer, baseTime) {
            const duration = layer.duration || 0.008;
            const delay = layer.delay || 0;
            const startTime = baseTime + delay;

            const frameCount = Math.max(Math.floor(context.sampleRate * duration), 1);
            const buffer = context.createBuffer(1, frameCount, context.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < frameCount; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (frameCount * 0.2));
            }

            const source = context.createBufferSource();
            source.buffer = buffer;

            const filter = context.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = layer.frequency || (layer.filter && layer.filter.frequency) || 3500;
            filter.Q.value = layer.q || (layer.filter && layer.filter.q) || 3;

            const gain = context.createGain();
            gain.gain.value = layer.gain || 0.2;

            source.connect(filter);
            filter.connect(gain);
            gain.connect(context.destination);

            source.start(startTime);
            source.stop(startTime + duration + 0.02);
        },

        playBodyLayer(context, layer, baseTime) {
            const duration = layer.duration || 0.04;
            const delay = layer.delay || 0;
            const startTime = baseTime + delay;

            const oscillator = context.createOscillator();
            const gain = context.createGain();

            oscillator.connect(gain);
            gain.connect(context.destination);

            oscillator.type = layer.type || 'sine';
            oscillator.frequency.value = layer.frequency || 400;

            gain.gain.setValueAtTime(layer.gain || 0.12, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            oscillator.start(startTime);
            oscillator.stop(startTime + duration + 0.02);
        }
    };

    window.SoundSystem = SoundSystem;
    window.updateSoundSettings = function (options) {
        return SoundSystem.updateSettings(options);
    };
    window.playSelectedSound = function () {
        return SoundSystem.playSelectedSound();
    };

    document.addEventListener('DOMContentLoaded', function () {
        SoundSystem.loadSettings();
        SoundSystem.loadLibrary().then(function () {
            SoundSystem.applySettingsToControls();
            SoundSystem.bindSettingsControls();
            SoundSystem.scanInteractiveElements();
            SoundSystem.observeInteractiveElements();
        });
    });
})();