
# 等待一段时间，以便操作系统可以处理终止的进程    
from selenium import webdriver  
from selenium.webdriver.common.keys import Keys  
from selenium.webdriver.common.by import By  
from selenium.webdriver.support.ui import WebDriverWait  
from selenium.webdriver.support import expected_conditions as EC  #导入相关库
from selenium.webdriver import ActionChains   
import time
from datetime import datetime
import subprocess
driver = webdriver.Chrome()
driver.get("https://kyfw.12306.cn/otn/resources/login.html")
while True:
    current_time = datetime.now()
    formatted_time = current_time.strftime("%H:%M:%S")
    if formatted_time == "10:32:50":
        driver.get("https://kyfw.12306.cn/otn/view/prefill_list.html?from=CUW&to=QRW&train=K1064&date=2024-02-04&fromName=%E9%87%8D%E5%BA%86%E5%8C%97&toName=%E6%B8%A0%E5%8E%BF")
        time.sleep(1.5)
        time.sleep(1)
        Button1 = driver.find_element(By.XPATH, "//*[@id=\"passenge_list\"]/li[7]/label/div/ins")
        Button1.click()
        Button2 = driver.find_element(By.XPATH, "//*[@id=\"panel-order-con\"]/div/div/a")
        Button2.click()
        time.sleep(2.7)
        Button3 = driver.find_element(By.XPATH, "//*[@id=\"trainList\"]/div[9]/div[2]/div/div[3]/div[4]/a")
        Button3.click()
        Button4 = driver.find_element(By.ID, "saveBtn")
        Button4.click()
        time.sleep(1)
        driver.get("https://kyfw.12306.cn/otn/view/prefill_order.html?fromName=%E9%87%8D%E5%BA%86%E5%8C%97&from=CUW&toName=%E6%B8%A0%E5%8E%BF&to=QRW&date=2024-02-04")
        time.sleep(2)
        while True:   
            count_down_text = driver.find_element(By.CLASS_NAME, 'count-down-text')
            if count_down_text == "1秒":
                time.sleep(1.3)
                button6 = driver.find_element(By.CSS_SELECTOR, "btn btn-hollow btn-sm w120 buy-ticket-button")  
                button6.click()
                button7 = driver.find_element(By.XPATH, "//*[@id=\"pop_170556355537687123\"]/div[2]/div[3]/a[2]")  
                button7.click()
                break
            else:
                continue
    else:
        continue