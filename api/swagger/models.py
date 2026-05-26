from marshmallow import Schema, fields

class FilterPayloadSchema(Schema):
    filter = fields.String(required=False)
    page = fields.Integer()
    limit = fields.Integer()

class ProductValuePayloadSchema(Schema):
    name = fields.String()
    likes = fields.Integer()

class UserNamePayloadSchema(Schema):
    name = fields.String()

class UserProductPayloadSchema(Schema):
    name = fields.String()
    value = fields.Float()

class UserPayloadSchema(Schema):
    user =  fields.Nested(UserNamePayloadSchema())
    products =  fields.List(fields.Nested(UserProductPayloadSchema()))

class ProductsPayloadSchema(Schema):
    products =  fields.List(fields.Nested(ProductValuePayloadSchema()))

class ProductPayloadSchema(Schema):
    name = fields.String()
    likes =  fields.Integer()

class ProductsResponseSchema(Schema):
    nomeProduto = fields.String()
    quantidadeLikes = fields.Integer()

class UserSimilarProductsResponseSchema(Schema):
    nomeCliente = fields.String()
    nomeProduto = fields.String()
    valor = fields.Float()
()
class UserDetailResponseSchema(Schema):
    nomeCliente = fields.String()
    nomeProduto = fields.String()
    valor = fields.Float()
    quantidadeLikes = fields.Integer()
    nomeClienteDestino = fields.String() 
    similaridade = fields.Float()

class UsersResponseSchema(Schema):
    nomeCliente = fields.String()
