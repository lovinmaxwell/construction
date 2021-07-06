from setuptools import setup, find_packages

with open('requirements.txt') as f:
	install_requires = f.read().strip().split('\n')

# get version from __version__ variable in construction/__init__.py
from construction import __version__ as version

setup(
	name='construction',
	version=version,
	description='Module for Construction Companies',
	author='Lovin Maxwell',
	author_email='lovin@etsqatar.net',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
