from flask import Flask, request
from service import initialize, create_user_data, get_similar_product, get_products_data, get_users_data, get_user_data, create_product_data, get_products_data, create_products_data, update_product_data
from flask_cors import CORS
from flask import Flask
from swagger.models import FilterPayloadSchema, UserPayloadSchema, UsersResponseSchema, UserDetailResponseSchema, UserSimilarProductsResponseSchema, ProductPayloadSchema, ProductsResponseSchema, ProductsPayloadSchema, ProductPayloadSchema
from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin
from flask_apispec import FlaskApiSpec, use_kwargs, marshal_with
# from swagger.config import api
# from swagger.docs import api
# from flask_restx import Api, Resource, reqparse
app = Flask(__name__)
CORS(app)

# 1. Configurar o gerador apispec
app.config.update({
    'APISPEC_SPEC': APISpec(
        title='API recommender systems',
        version='v1',
        openapi_version='2.0',
        plugins=[MarshmallowPlugin()],
    ),
    'APISPEC_SWAGGER_URL': '/swagger/' # Endpoint da documentação
})

docs = FlaskApiSpec(app)

@app.route("/",methods=['GET'])
def health(**kwargs):
    try: 
        return 'True'
    except Exception as e:
        print(e)
        return e
    
@app.route("/init",methods=['POST'])
def init(**kwargs):
    try: 
        initialize()
        return 'True'
    except Exception as e:
        print(e)
        return e

@app.route('/user', methods=['POST'])
@use_kwargs(UserPayloadSchema(), location='json') # Valida payload recebido
def create_user(**kwargs):
    try: 
        return create_user_data(request.json)
    except Exception as e:
        print(e)
        return e

@app.route('/users', methods=['GET'])
@use_kwargs(FilterPayloadSchema(), location='query')  # Defines **kwargsquery string params
@marshal_with(UsersResponseSchema(many=True))               # Formata JSON retornado
def get_users(**kwargs):
    try: 
        return get_users_data(request.args)
    except Exception as e:
        print(e)
        return e

@app.route('/user/<name>', methods=['GET'])
@marshal_with(UserDetailResponseSchema(many=True))               # Formata JSON retornado
def get_user(name, **kwargs):
    try: 
        return get_user_data(name)
    except Exception as e:
        print(e)
        return e

@app.route('/user_product/<name>', methods=['GET'])
@use_kwargs(FilterPayloadSchema(), location='query')  # Defines **kwargsquery string params
@marshal_with(UserSimilarProductsResponseSchema(many=True))               # Formata JSON retornado
def get_user_similar(name, **kwargs):
    try: 
        return get_similar_product(name, request.args)
    except Exception as e:
        print(e)
        return e

@app.route('/product', methods=['POST'])
@use_kwargs(ProductPayloadSchema(), location='json') # Valida payload recebido
def create_product(**kwargs):
    try: 
        return create_product_data(request.json)
    except Exception as e:
        print(e)
        return e

@app.route('/products', methods=['GET'])
@marshal_with(ProductsResponseSchema(many=True))               # Formata JSON retornado
@use_kwargs(FilterPayloadSchema(), location='query')  # Defines **kwargsquery string params
def get_products(**kwargs):
    try: 
        print(kwargs)
        return get_products_data(request.args)
    except Exception as e:
        print(e)
        return e

@app.route('/products', methods=['POST'])
@use_kwargs(ProductsPayloadSchema(), location='json') # Valida payload recebido
def create_products(**kwargs):
    try: 
        return create_products_data(request.json)
    except Exception as e:
        print(e)
        return e

@app.route('/product', methods=['PUT'])
@use_kwargs(ProductPayloadSchema(), location='json') # Valida payload recebido
def update_product(**kwargs):
    try: 
        return update_product_data(request.json)
    except Exception as e:
        print(e)
        return e

docs.register(health)
docs.register(init)
docs.register(create_user)
docs.register(get_users)
docs.register(get_user)
docs.register(get_user_similar)
docs.register(create_product)
docs.register(get_products)
docs.register(create_products)
docs.register(update_product)