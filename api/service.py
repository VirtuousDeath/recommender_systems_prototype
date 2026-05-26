import sqlite3
from helpers import getSimilars
import json
from urllib.parse import unquote

def initialize():
    # 1. Connect to a database (or create it)
    connection = sqlite3.connect('recommender_system.db')

    # 2. Create a cursor object
    cursor = connection.cursor()
    
    cursor.execute('''DROP TABLE IF EXISTS [tbClienteSimilaridade]''')
    cursor.execute('''DROP TABLE IF EXISTS [tbClienteProduto]''')
    cursor.execute('''DROP TABLE IF EXISTS [tbProduto]''')
    cursor.execute('''DROP TABLE IF EXISTS [tbCliente]''')
    # 3. Create a table
    cursor.execute('''CREATE TABLE [tbCliente](
    [nomeCliente] [varchar](50) NOT NULL,
    CONSTRAINT [PK_tbCliente] PRIMARY KEY([nomeCliente] ASC))''')
    cursor.execute('''CREATE TABLE [tbProduto](
    [nomeProduto] [varchar](50) NOT NULL,
    [quantidadeLikes] [int] NULL,
    CONSTRAINT [PK_tbProduto] PRIMARY KEY([nomeProduto] ASC))''')
    cursor.execute('''CREATE TABLE [tbClienteProduto](
    [nomeCliente] [varchar](50) NOT NULL,
    [nomeProduto] [varchar](50) NOT NULL,
    [valor] [float] NULL,
    CONSTRAINT [PK_tbClienteProduto] PRIMARY KEY([nomeCliente] ASC, [nomeProduto] ASC))''')
    cursor.execute('''CREATE TABLE [tbClienteSimilaridade](
    [nomeClienteOrigem] [varchar](50) NOT NULL,
    [nomeClienteDestino] [varchar](50) NOT NULL,
    [similaridade] [float] NOT NULL,
    CONSTRAINT [PK_tbClienteDistancia] PRIMARY KEY([nomeClienteOrigem] ASC, [nomeClienteDestino] ASC))''')
    
    connection.commit()
    # 7. Close the connection
    connection.close()

    return 'True'

def get_user_data(name): 
    connection = sqlite3.connect('recommender_system.db')

    # 2. Create a cursor object
    cursor = connection.cursor()

    # 6. Query and fetch data
    cursor.execute(f'''SELECT a.nomeCliente, c.nomeProduto, b.valor, c.quantidadeLikes, d.nomeClienteDestino, d.similaridade FROM tbCliente a, tbClienteProduto b, tbProduto c, tbClienteSimilaridade d
    WHERE a.nomeCliente = b.nomeCliente AND b.nomeProduto = c.nomeProduto AND d.nomeClienteOrigem = a.nomeCliente AND a.nomeCliente = '{name}'
    order by d.similaridade desc, c.quantidadeLikes desc''')
    result = cursor.fetchall()

    connection.close()

    return [ {"nomeCliente": res[0], "nomeProduto": res[1], "valor": res[2], "quantidadeLikes": res[3], "nomeClienteDestino": res[4], "similaridade": res[5] } for res in result]

def get_users_data(data): 
    connection = sqlite3.connect('recommender_system.db')

    # 2. Create a cursor object
    cursor = connection.cursor()

    # 6. Query and fetch data
    cursor.execute(f'''SELECT nomeCliente FROM tbCliente limit {data['limit']} offset {int(data['limit'])*(int(data['page']) - 1)}''')
    result = cursor.fetchall()

    connection.close()

    return [ {"nomeCliente": res[0] } for res in result]

def create_user_data(data):
    # 1. Connect to a database (or create it)
    connection = sqlite3.connect('recommender_system.db')
    # 2. Create a cursor object
    cursor = connection.cursor()
    # 4. Insert data
    cursor.execute(f"INSERT INTO tbCliente (nomeCliente) VALUES ('{data['user']['name']}') ON CONFLICT (nomeCliente) DO NOTHING")
    
    for product in data['products']:
        cursor.execute(f"INSERT INTO tbClienteProduto(nomeCliente,nomeProduto,valor) VALUES ('{data['user']['name']}','{product['name']}',{int(product['value'])}) ON CONFLICT (nomeCliente,nomeProduto) DO NOTHING")
    connection.commit()

    users = cursor.execute(f'''SELECT * FROM tbCliente''').fetchall()
    print(users)
    similarities = {}
    for user in users:
        users_products = cursor.execute(f"SELECT b.nomeProduto, b.valor FROM tbCliente a, tbClienteProduto b WHERE a.nomeCliente = b.nomeCliente AND b.nomeCliente = '{user[0]}'").fetchall()
        similarities[user[0]] = { user_product[0]: user_product[1] for user_product in users_products }

    similars = [getSimilars(similarities, user[0]) for user in users]
    print(similars)
    for i in range(len(similars)): 
        one = users[i][0]
        for similar in similars[i]:
            value, another  = similar
            cursor.execute(f'''INSERT INTO tbClienteSimilaridade(nomeClienteOrigem,nomeClienteDestino,similaridade) VALUES ('{one}','{another}',{value})
            ON CONFLICT (nomeClienteOrigem,nomeClienteDestino) 
            DO UPDATE SET similaridade = {value}''')

    connection.commit()
    # 7. Close the connection
    connection.close()

    return 'True'

def get_similar_product(name, data):
    connection = sqlite3.connect('recommender_system.db')

    # 2. Create a cursor object
    cursor = connection.cursor()

    # 6. Query and fetch data
    cursor.execute(f'''SELECT b.nomeCliente, b.nomeProduto, b.valor FROM tbCliente a, tbClienteProduto b, tbProduto c, tbClienteSimilaridade d
    WHERE a.nomeCliente = b.nomeCliente AND b.nomeProduto = c.nomeProduto AND d.nomeClienteOrigem = a.nomeCliente
    AND b.nomeProduto NOT IN
    (SELECT b.nomeProduto FROM tbCliente a, tbClienteProduto b, tbProduto c
    WHERE a.nomeCliente = b.nomeCliente AND b.nomeProduto = c.nomeProduto AND b.nomeCliente = '{name}') group by b.nomeCliente, b.nomeProduto, b.valor order by b.valor desc, d.similaridade desc limit {data['limit']} offset {int(data['limit'])*(int(data['page']) - 1)}''')
    result = cursor.fetchall()

    connection.close()

    return [ {"nomeCliente": res[0], "nomeProduto": res[1], "valor": res[2] } for res in result]

def get_products_data(data): 
    connection = sqlite3.connect('recommender_system.db')

    # 2. Create a cursor object
    cursor = connection.cursor()
    filterSelect = ''
    if "filter" in data:
        filterData = dict(json.loads(unquote(data['filter']))).items()
        filterSelect = " WHERE " + " AND ".join([f"{key} like '{value}%'" for key, value in filterData])
    # 6. Query and fetch data
    cursor.execute(f'''SELECT nomeProduto, quantidadeLikes FROM tbProduto {filterSelect} order by quantidadeLikes desc limit {data['limit']} offset {int(data['limit'])*(int(data['page']) - 1)}''')
    result = cursor.fetchall()

    connection.close()

    return [ {"nomeProduto": res[0], "quantidadeLikes": res[1] } for res in result]

def create_product_data(data): 
    # 1. Connect to a database (or create it)
    connection = sqlite3.connect('recommender_system.db')

    # 2. Create a cursor object
    cursor = connection.cursor()
    cursor.execute(f"INSERT INTO tbProduto (nomeProduto,quantidadeLikes) VALUES ('{data['name']}',{data['likes']}) ON CONFLICT (nomeProduto) DO NOTHING")

    connection.commit()
    # 7. Close the connection
    connection.close()

    return 'True'

def create_products_data(data): 
    # 1. Connect to a database (or create it)
    connection = sqlite3.connect('recommender_system.db')

    # 2. Create a cursor object
    cursor = connection.cursor()
    for product in data['products']:
        cursor.execute(f"INSERT INTO tbProduto (nomeProduto,quantidadeLikes) VALUES ('{product['name']}',{product['likes']}) ON CONFLICT (nomeProduto) DO NOTHING")

    connection.commit()
    # 7. Close the connection
    connection.close()

    return 'True'

def update_product_data(data): 
    # 1. Connect to a database (or create it)
    connection = sqlite3.connect('recommender_system.db')
    # 2. Create a cursor object
    cursor = connection.cursor()

    cursor.execute(f"UPDATE tbProduto SET quantidadeLikes = quantidadeLikes + 1 WHERE nomeProduto = '{data['name']}'")
    connection.commit()
    # 7. Close the connection
    connection.close()

    return 'True'
