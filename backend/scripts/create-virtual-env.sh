#/bin/bash -v

# Create new python virtual environment
python3 -m venv ./virtual-environment

source ./virtual-environment/bin/activate

# to install necessary packages in requirements.txt
pip3 install -r requirements.txt