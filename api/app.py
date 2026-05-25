from flask import Flask, request
from service import initialize, create_user_data, get_similar_product, get_products_data, get_users_data, get_user_data, create_product_data, get_products_data, create_products_data, update_product_data
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.route("/",methods=['GET'])
def health():
    try: 
        return 'True'
    except Exception as e:
        print(e)
        return e
    
@app.route("/init",methods=['POST'])
def init():
    try: 
        initialize()
        return 'True'
    except Exception as e:
        print(e)
        return e

@app.route('/user', methods=['POST'])
def create_user():
    try: 
        return create_user_data(request.json)
    except Exception as e:
        print(e)
        return e

@app.route('/users', methods=['GET'])
def get_users():
    try: 
        return get_users_data(request.args)
    except Exception as e:
        print(e)
        return e

@app.route('/user/<name>', methods=['GET'])
def get_user(name):
    try: 
        return get_user_data(name)
    except Exception as e:
        print(e)
        return e

@app.route('/user_product/<name>', methods=['GET'])
def get_user_similar(name):
    try: 
        return get_similar_product(name, request.args)
    except Exception as e:
        print(e)
        return e

@app.route('/product', methods=['POST'])
def create_product():
    try: 
        return create_product_data(request.json)
    except Exception as e:
        print(e)
        return e

@app.route('/products', methods=['GET'])
def get_products():
    try: 
        return get_products_data(request.args)
    except Exception as e:
        print(e)
        return e

@app.route('/products', methods=['POST'])
def create_products():
    try: 
        return create_products_data(request.json)
    except Exception as e:
        print(e)
        return e

@app.route('/product', methods=['PUT'])
def update_product():
    try: 
        return update_product_data(request.json)
    except Exception as e:
        print(e)
        return e