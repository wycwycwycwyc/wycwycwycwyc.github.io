"""
本程序为反应测试辅助工具，仅支持由红变绿的反应测试，
如有其他需求，请自行修改
"""
import numpy as np
import cv2
import keyboard
import pyautogui
from mss import MSS

# ====================== 配置 ======================
screen_w, screen_h = pyautogui.size()
# 扫描区域，越小速度越快
scan_w = 400
scan_h = 400
scan_left = (screen_w - scan_w) // 2
scan_top = (screen_h - scan_h) // 2
monitor = {"top": scan_top, "left": scan_left, "width": scan_w, "height": scan_h}

# 颜色HSV区间
RED_L1 = np.array([0, 15, 15], dtype=np.uint8)
RED_U1 = np.array([15, 255, 255], dtype=np.uint8)
RED_L2 = np.array([165, 15, 15], dtype=np.uint8)
RED_U2 = np.array([180, 255, 255], dtype=np.uint8)

GREEN_L = np.array([25, 15, 15], dtype=np.uint8)
GREEN_U = np.array([85, 255, 255], dtype=np.uint8)

MIN_AREA = 10
STABLE_FRAME = 1
CLICK_X, CLICK_Y = screen_w // 2, screen_h // 2
# ==================================================

sct = MSS()

def get_hsv_img():
    frame = np.array(sct.grab(monitor))[:, :, :3]
    return cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

def find_color_block(hsv_img, low1, high1, low2=None, high2=None):
    mask1 = cv2.inRange(hsv_img, low1, high1)
    if low2 is not None:
        mask2 = cv2.inRange(hsv_img, low2, high2)
        mask = cv2.bitwise_or(mask1, mask2)
    else:
        mask = mask1
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for cnt in contours:
        if cv2.contourArea(cnt) > MIN_AREA:
            return True
    return False

def main():
    pyautogui.FAILSAFE = True
    prev_red = False
    green_stable = 0

    while True:
        if keyboard.is_pressed("esc"):
            break

        hsv = get_hsv_img()
        has_red = find_color_block(hsv, RED_L1, RED_U1, RED_L2, RED_U2)
        has_green = find_color_block(hsv, GREEN_L, GREEN_U)

        if has_red:
            prev_red = True
            green_stable = 0
        elif has_green and prev_red:
            green_stable += 1
            if green_stable >= STABLE_FRAME:
                pyautogui.click(CLICK_X, CLICK_Y)
                prev_red = False
                green_stable = 0
        else:
            prev_red = False
            green_stable = 0

if __name__ == "__main__":
    main()