#include <iostream>
#include <string>
#include <thread>
#include <chrono>
#include <windows.h>

void sendMessage(const std::string &message, int count, bool addSerial, int intervalMs)
{
  std::cout << "准备发送 " << count << " 条消息，5秒后开始..." << std::endl;
  std::cout << "请确保聊天窗口是当前活动窗口！" << std::endl;

  // 5秒准备时间
  for (int i = 5; i > 0; i--)
  {
    std::cout << i << "..." << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(1));
  }

  std::cout << "开始发送..." << std::endl;

  for (int i = 0; i < count; i++)
  {
    // 构建要发送的消息
    std::string currentMessage = message;
    if (addSerial)
    {
      currentMessage += " (" + std::to_string(i + 1) + ")";
    }

    // 将消息复制到剪贴板
    if (OpenClipboard(nullptr))
    {
      EmptyClipboard();
      HGLOBAL hMem = GlobalAlloc(GMEM_MOVEABLE, currentMessage.size() + 1);
      if (hMem)
      {
        memcpy(GlobalLock(hMem), currentMessage.c_str(), currentMessage.size() + 1);
        GlobalUnlock(hMem);
        SetClipboardData(CF_TEXT, hMem);
      }
      CloseClipboard();
    }

    // 粘贴消息 (Ctrl+V)
    keybd_event(VK_CONTROL, 0, 0, 0);
    keybd_event('V', 0, 0, 0);
    keybd_event('V', 0, KEYEVENTF_KEYUP, 0);
    keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, 0);

    // 发送消息 (Enter)
    keybd_event(VK_RETURN, 0, 0, 0);
    keybd_event(VK_RETURN, 0, KEYEVENTF_KEYUP, 0);

    // 如果有间隔时间，等待
    if (intervalMs > 0 && i < count - 1)
    {
      std::this_thread::sleep_for(std::chrono::milliseconds(intervalMs));
    }

    std::cout << "已发送第 " << (i + 1) << " 条" << std::endl;
  }

  std::cout << "\n完成！共发送 " << count << " 条消息。" << std::endl;
}

int main()
{
  while (true)
  {
    std::string message;
    int count = 100;
    bool addSerial = false;
    int intervalMs = 0;

    std::cout << "\n=== 消息自动发送器 ===" << std::endl;
    std::cout << "请输入要发送的消息内容：" << std::endl;
    std::cout << ">>> ";
    std::getline(std::cin, message);

    if (message == "exit" || message == "quit")
    {
      break;
    }

    std::cout << "\n请输入要发送的次数（默认100次）：" << std::endl;
    std::cout << ">>> ";
    std::string countStr;
    std::getline(std::cin, countStr);
    if (!countStr.empty())
    {
      try
      {
        count = std::stoi(countStr);
      }
      catch (...)
      {
        std::cout << "输入无效，使用默认值100次" << std::endl;
        count = 100;
      }
    }

    std::cout << "\n是否在文本末尾添加序号？(y/n，默认n)：" << std::endl;
    std::cout << ">>> ";
    std::string addSerialStr;
    std::getline(std::cin, addSerialStr);
    if (!addSerialStr.empty() && (addSerialStr[0] == 'y' || addSerialStr[0] == 'Y'))
    {
      addSerial = true;
    }

    std::cout << "\n请输入发送间隔时间（毫秒，默认0无间隔）：" << std::endl;
    std::cout << ">>> ";
    std::string intervalStr;
    std::getline(std::cin, intervalStr);
    if (!intervalStr.empty())
    {
      try
      {
        intervalMs = std::stoi(intervalStr);
      }
      catch (...)
      {
        std::cout << "输入无效，使用默认值0毫秒" << std::endl;
        intervalMs = 0;
      }
    }

    sendMessage(message, count, addSerial, intervalMs);

    // 短暂暂停，让用户看到结果
    std::this_thread::sleep_for(std::chrono::seconds(2));

    // 清空输入缓冲区
    std::cin.clear();
  }

  std::cout << "程序已退出" << std::endl;
  return 0;
}