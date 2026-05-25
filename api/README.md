Install python using conda: [![install Anaconda](https://docs.conda.io/projects/conda/en/stable/user-guide/install/index.html)]

create Env:
`$ conda create --name myenv`
activate Env:
`$ conda activate myenv`
install packages:
`$ pip install Flask`
`$ pip install flask-cors`

Run Api project:
`$ flask --app app run --debug`

install nodejs (more details in app README) and install postman-cli:
`$ npm install -g postman-cli`
To initialize the Database
`$ postman request POST 'http://127.0.0.1:5000/init' \ --body ''`