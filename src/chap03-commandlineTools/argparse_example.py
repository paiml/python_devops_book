#!/usr/bin/env python
"""
Command line tool using argparse
"""
import argparse


def sail():
    ship_name = 'Your ship'
    print(f"{ship_name} is setting sail")


def list_ships():
    ships = ['John B', 'Yankee Clipper', 'Pequod']
    print(f"Ships: {','.join(ships)}")


def greet(greeting, name):
    message = f'{greeting} {name}'
    print(message)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Maritime control')
    
    parser.add_argument('--twice', '-t',
                        help='Do it twice',
                        action='store_true')


    subparsers = parser.add_subparsers(dest='func')

    ship_parser =  subparsers.add_parser('ships', 
                                         help='Ship related commands')
    ship_parser.add_argument('command',
                             choices=['list', 'sail'])


    sailor_parser = subparsers.add_parser('sailors',
                                          help='Talk to a sailor')
    sailor_parser.add_argument('name',
                               help='Sailors name')
    sailor_parser.add_argument('--greeting', '-g',
                               help='Greeting',
                               default='Ahoy there')

    args = parser.parse_args()
    if args.func == 'sailors':
        greet(args.greeting, args.name)
    elif args.command == 'list':
        list_ships()
    else:
        sail()

