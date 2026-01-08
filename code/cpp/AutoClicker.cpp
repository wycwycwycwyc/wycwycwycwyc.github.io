#include <iostream>
#include <string>
#include <thread>
#include <chrono>
#include <atomic>
#include <windows.h>

// 全局原子变量，用于控制连点
std::atomic<bool> g_clicking(false);
std::atomic<bool> g_stopRequested(false);

// 键盘监听线程函数
void keyboardListener(int stopKey)
{
  while (g_clicking && !g_stopRequested)
  {
    // 检查停止按键是否被按下
    if (GetAsyncKeyState(stopKey) & 0x8000)
    {
      g_stopRequested = true;
      break;
    }
    std::this_thread::sleep_for(std::chrono::milliseconds(10));
  }
}

// 鼠标连点函数
void mouseClicker(int intervalMs, int durationMs, int stopKey)
{
  std::cout << "\n鼠标连点器将在5秒后启动..." << std::endl;
  std::cout << "请将鼠标移动到需要点击的位置！" << std::endl;

  if (durationMs > 0)
  {
    std::cout << "连点将持续 " << durationMs << " 毫秒 (" << durationMs / 1000 << " 秒)" << std::endl;
  }
  else if (stopKey != 0)
  {
    std::cout << "按指定键结束连点" << std::endl;
  }

  // 5秒倒计时
  for (int i = 5; i > 0; i--)
  {
    std::cout << i << "..." << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(1));
  }

  std::cout << "开始连点！" << std::endl;

  g_clicking = true;
  g_stopRequested = false;

  // 启动键盘监听线程（如果设置了停止键）
  std::thread keyboardThread;
  if (stopKey != 0)
  {
    keyboardThread = std::thread(keyboardListener, stopKey);
  }

  auto startTime = std::chrono::steady_clock::now();
  int clickCount = 0;

  // 主连点循环
  while (g_clicking && !g_stopRequested)
  {
    // 模拟鼠标左键按下和释放
    mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0);
    std::this_thread::sleep_for(std::chrono::milliseconds(10)); // 短暂保持按下状态
    mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);

    clickCount++;

    // 检查持续时间是否已到
    if (durationMs > 0)
    {
      auto currentTime = std::chrono::steady_clock::now();
      auto elapsed = std::chrono::duration_cast<std::chrono::milliseconds>(currentTime - startTime).count();

      if (elapsed >= durationMs)
      {
        g_stopRequested = true;
        break;
      }
    }

    // 等待间隔时间
    if (intervalMs > 0)
    {
      std::this_thread::sleep_for(std::chrono::milliseconds(intervalMs));
    }
  }

  g_clicking = false;

  // 等待键盘监听线程结束
  if (keyboardThread.joinable())
  {
    keyboardThread.join();
  }

  auto endTime = std::chrono::steady_clock::now();
  auto totalTime = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime).count();

  std::cout << "\n连点结束！" << std::endl;
  std::cout << "共点击 " << clickCount << " 次" << std::endl;
  std::cout << "总耗时 " << totalTime << " 毫秒 (" << totalTime / 1000.0 << " 秒)" << std::endl;
  std::cout << "平均速度: " << (clickCount * 1000.0 / totalTime) << " 次/秒" << std::endl;
}

// 将按键字符转换为虚拟键码
int getKeyCode(const std::string &keyStr)
{
  if (keyStr.empty())
    return 0;

  char keyChar = std::toupper(keyStr[0]);

  // 如果是字母
  if (keyChar >= 'A' && keyChar <= 'Z')
  {
    return keyChar; // 字母的ASCII码就是虚拟键码
  }

  // 如果是数字
  if (keyChar >= '0' && keyChar <= '9')
  {
    return keyChar;
  }

  // 特殊按键
  if (keyStr.length() > 1)
  {
    std::string upperKey = keyStr;
    for (char &c : upperKey)
      c = std::toupper(c);

    if (upperKey == "ESC")
      return VK_ESCAPE;
    if (upperKey == "SPACE")
      return VK_SPACE;
    if (upperKey == "ENTER")
      return VK_RETURN;
    if (upperKey == "TAB")
      return VK_TAB;
    if (upperKey == "CTRL")
      return VK_CONTROL;
    if (upperKey == "ALT")
      return VK_MENU;
    if (upperKey == "SHIFT")
      return VK_SHIFT;
    if (upperKey == "F1")
      return VK_F1;
    if (upperKey == "F2")
      return VK_F2;
    if (upperKey == "F3")
      return VK_F3;
    if (upperKey == "F4")
      return VK_F4;
    if (upperKey == "F5")
      return VK_F5;
    if (upperKey == "F6")
      return VK_F6;
    if (upperKey == "F7")
      return VK_F7;
    if (upperKey == "F8")
      return VK_F8;
    if (upperKey == "F9")
      return VK_F9;
    if (upperKey == "F10")
      return VK_F10;
    if (upperKey == "F11")
      return VK_F11;
    if (upperKey == "F12")
      return VK_F12;
  }

  return 0; // 未知按键
}

// 将虚拟键码转换为可读名称
std::string getKeyName(int keyCode)
{
  if (keyCode == 0)
    return "无";
  if (keyCode == VK_ESCAPE)
    return "ESC";
  if (keyCode == VK_SPACE)
    return "空格键";
  if (keyCode == VK_RETURN)
    return "回车键";
  if (keyCode == VK_TAB)
    return "Tab键";
  if (keyCode == VK_CONTROL)
    return "Ctrl键";
  if (keyCode == VK_MENU)
    return "Alt键";
  if (keyCode == VK_SHIFT)
    return "Shift键";
  if (keyCode >= VK_F1 && keyCode <= VK_F12)
    return "F" + std::to_string(keyCode - VK_F1 + 1);
  if (keyCode >= 'A' && keyCode <= 'Z')
    return std::string(1, (char)keyCode) + "键";
  if (keyCode >= '0' && keyCode <= '9')
    return std::string(1, (char)keyCode) + "键";

  return "未知按键";
}

int main()
{
  while (true)
  {
    std::cout << "\n=== 鼠标连点器 ===" << std::endl;
    std::cout << "1. 开始连点" << std::endl;
    std::cout << "2. 退出程序" << std::endl;
    std::cout << ">>> ";

    std::string choice;
    std::getline(std::cin, choice);

    if (choice == "2" || choice == "exit" || choice == "quit")
    {
      break;
    }

    if (choice != "1")
    {
      continue;
    }

    // 设置连点速度（毫秒）
    int intervalMs = 0;
    std::cout << "\n请输入点击间隔时间（毫秒，默认0ms，即最快速度）：" << std::endl;
    std::cout << ">>> ";
    std::string intervalStr;
    std::getline(std::cin, intervalStr);
    if (!intervalStr.empty())
    {
      try
      {
        intervalMs = std::stoi(intervalStr);
        if (intervalMs < 0)
          intervalMs = 0;
      }
      catch (...)
      {
        std::cout << "输入无效，使用默认值0ms" << std::endl;
        intervalMs = 0;
      }
    }

    // 设置持续时间
    int durationMs = 0;
    std::cout << "\n请选择结束方式：" << std::endl;
    std::cout << "1. 按指定键结束" << std::endl;
    std::cout << "2. 按持续时间结束" << std::endl;
    std::cout << ">>> ";
    std::string endChoice;
    std::getline(std::cin, endChoice);

    int stopKey = 0;

    if (endChoice == "2")
    {
      std::cout << "\n请输入连点持续时间（毫秒，例如：5000=5秒）：" << std::endl;
      std::cout << ">>> ";
      std::string durationStr;
      std::getline(std::cin, durationStr);
      if (!durationStr.empty())
      {
        try
        {
          durationMs = std::stoi(durationStr);
          if (durationMs < 0)
            durationMs = 0;
        }
        catch (...)
        {
          std::cout << "输入无效，将使用按键结束方式" << std::endl;
          endChoice = "1";
        }
      }
    }

    if (endChoice == "1" || durationMs == 0)
    {
      std::cout << "\n请输入停止连点的按键：" << std::endl;
      std::cout << "示例：A, B, C, 1, 2, 3, ESC, SPACE, ENTER, F1等" << std::endl;
      std::cout << ">>> ";
      std::string keyStr;
      std::getline(std::cin, keyStr);

      stopKey = getKeyCode(keyStr);
      if (stopKey == 0)
      {
        std::cout << "无效按键，将使用ESC键作为停止键" << std::endl;
        stopKey = VK_ESCAPE;
      }
    }

    // 显示设置摘要
    std::cout << "\n=== 设置摘要 ===" << std::endl;
    std::cout << "点击间隔: " << intervalMs << "ms" << std::endl;
    if (durationMs > 0)
    {
      std::cout << "持续时间: " << durationMs << "ms (" << durationMs / 1000.0 << "秒)" << std::endl;
    }
    else
    {
      std::cout << "停止按键: " << getKeyName(stopKey) << std::endl;
    }
    std::cout << "================\n"
              << std::endl;

    // 开始连点
    mouseClicker(intervalMs, durationMs, stopKey);

    // 短暂暂停
    std::cout << "\n3秒后返回主菜单..." << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(3));
  }

  std::cout << "\n程序已退出" << std::endl;
  return 0;
}