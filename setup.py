from setuptools import setup, find_packages

with open('requirements.txt') as f:
	install_requires = f.read().strip().split('\n')

# get version from __version__ variable in ets/__init__.py
from ets import __version__ as version

setup(
	name='ets',
	version=version,
	description='Construction App for ETS',
	author='Lovin Maxwell',
	author_email='lovin@etsqatar.net',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
