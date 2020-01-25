setup:
	## Recommend you create a virtualenv
	#python3 -m venv ~/.devops-book
	#source ~/.devops-book
	### Create alias in bash or zsh
	#alias devops-book="cd ~/src/python_devops_book && source ~/.devops-book/bin/activate"

install:
	pip install --upgrade pip && \
		pip install -r requirements.txt

test:
	#python -m pytest -vv --cov=myrepolib tests/*.py
	#python -m pytest --nbval notebook.ipynb


lint:
	pylint --disable=R,C,W1202 \
		src/chap14-MLOps/flask-sklearn/*.py

all: install lint test
