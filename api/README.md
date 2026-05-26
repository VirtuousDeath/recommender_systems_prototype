## Installation
Install python using conda: [install Anaconda](https://docs.conda.io/projects/conda/en/stable/user-guide/install/index.html)
create Env:
```bash
conda create --name myenv
```
activate Env:
```bash
conda activate myenv
```
install packages:
```bash
pip install Flask flask-cors Flask-RESTx
```

## Executing
Run Api project:
```bash
flask --app app run --debug
```

## Testing
install nodejs (more details in app README) and install postman-cli:
```bash
npm install -g postman-cli
```
To initialize the Database
```bash
postman request POST 'http://127.0.0.1:5000/init' \ --body ''
```