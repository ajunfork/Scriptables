# 导入所需的库
import requests
import json
import time

# 定义API密钥和端点
API_KEY = "secret_YiwJxU7kozFtA8dLxFeQidl8tmcDxmnzPB1M8qh8gf9"
TASKS_ID = "4880702139ad4b40a009c62cfa3d5bd7"
PROJ_ID = "ef54fb2d0bca45d9b433fbff51513e78" 

BASE_URL = "https://api.notion.com/v1"

# 设置请求头
headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json"
}

# 注意：Notion API 不支持直接将页面设置为公开
# 以下函数已被注释掉，因为它不能正常工作
"""
def make_page_public(page_id):
    url = f"{BASE_URL}/pages/{page_id}"
    payload = {
        "public": True
    }
    response = requests.patch(url, headers=headers, json=payload)
    if response.status_code == 200:
        print(f"成功将页面 {page_id} 设置为公开")
    else:
        print(f"设置页面公开失败: {response.status_code}")
        print(response.text)

# 调用函数将指定页面设置为公开
make_page_public(TASKS_ID)
"""


def get_database_fields(database_id):
    url = f"{BASE_URL}/databases/{database_id}"
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        return data.get('properties', {})
    else:
        print(f"获取数据库字段失败: {response.status_code}")
        print(f"错误信息: {response.text}")
        return {}
# 获取数据库中的所有页面
def get_articles():
    url = f"{BASE_URL}/databases/{TASKS_ID}/query"
    response = requests.post(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        articles = data.get("results", [])
        return articles
    else:
        print(f"获取文章失败: {response.status_code}")
        print(f"错误信息: {response.text}")  # 添加这行来打印详细的错误信息
        return []

def print_article(article):
    print("文章信息:")
    print(f"标题: {article.get('properties', {}).get('Name', {}).get('title', [{}])[0].get('plain_text', '无标题')}")
    print(f"状态: {article.get('properties', {}).get('Status', {}).get('select', {}).get('name', '未知')}")
    print(f"创建时间: {article.get('created_time', '未知')}")
    print(f"最后编辑时间: {article.get('last_edited_time', '未知')}")
    print("---")

# 删除单个文章
def delete_article(page_id, max_retries=5, retry_delay=1):
    url = f"{BASE_URL}/pages/{page_id}"
    for attempt in range(max_retries):
        response = requests.delete(url, headers=headers)
        
        if response.status_code == 200:
            print(f"成功删除文章: {page_id}")
            return
        else:
            print(f"删除文章失败: {page_id}, 状态码: {response.status_code}")
            if attempt < max_retries - 1:
                print(f"等待{retry_delay}秒后重试...")
                time.sleep(retry_delay)
            else:
                print(f"已达到最大重试次数，无法删除文章: {page_id}")


print(get_database_fields(TASKS_ID))

# 获取所有文章
articles = get_articles()

# 打印获取到的文章数量
print(f"获取到 {len(articles)} 篇文章")

# 打印所有文章信息
# for article in articles:
#     print_article(article)

# 删除所有文章
for article in articles:
    print_article(article)
    page_id = article["id"]
    delete_article(page_id)

# print("所有文章删除操作已完成")