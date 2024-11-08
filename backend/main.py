from ciaos import save , get
import requests
# def save_sucess():
#     API_URL = "https://storage.cialabs.org"
#     key="mykeyss"
#     data_list=["why","what"]

#     # response=save(API_URL,key,data_list)
#     print (response)

# save_sucess()

def get_success():
    API_URL = "https://storage.cialabs.org"
    key="mykeyss"
    response=get(API_URL,key)
    print(response)

get_success()