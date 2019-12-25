# Python For DevOps: Learn Ruthlessly Effective Automation
#### Publisher:  O'Reilly Media
#### Release Date:  December 31st, 2019

![Python for Unix and Linux System Administration](https://www.noahgift.com/img/python_devops.png)

* [Buy a Physical Copy from Amazon](https://www.amazon.com/Python-DevOps-Ruthlessly-Effective-Automation-dp-149205769X/dp/149205769X)
* [Buy a Kindle Copy from Amazon](https://www.amazon.com/Python-DevOps-Ruthlessly-Effective-Automation-ebook-dp-B082P97LDW/dp/B082P97LDW)
* [Read Online](http://shop.oreilly.com/product/0636920274902.do)
* [Download Source Code from Github](https://github.com/paiml/python_devops_book)
* [Python for DevOps Website](https://pythondevops.com/)

### Abstract
Much has changed in technology over the past decade. Data is hot, the cloud is ubiquitous, and many organizations need some form of automation. Throughout these transformations, Python has become one of the most popular languages in the world. This practical resource shows you how to use Python for everyday Linux systems administration tasks with today’s most useful DevOps tools, including Docker, Kubernetes, and Terraform.

Learning how to interact and automate with Linux is essential for millions of professionals. Python makes it much easier. With this book, you’ll learn how to develop software and solve problems using containers, as well as how to monitor, instrument, load-test, and operationalize your software. Looking for effective ways to "get stuff done" in Python? This is your guide.

Python foundations, including a brief introduction to the language
How to automate text, write command-line tools, and automate the filesystem
Linux utilities, package management, build systems, monitoring and instrumentation, and automated testing
Cloud computing, infrastructure as code, Kubernetes, and serverless
Machine learning operations and data engineering from a DevOps perspective
Building, deploying, and operationalizing a machine learning project



## Got Feedback?

If you have any suggestions as the book is being developed please [create a ticket](https://github.com/paiml/python_devops_book/issues) and let us know!  Thanks for helping make this an incredible book.

## Book Outline

Here’s the outline for the first edition -- just note any major changes, chapter-by-chapter, especially any new sections or chapters. OK to simply describe the scope of changes in a couple of sentences under each chapter heading.

1. An almost illegal Python Tutorial

Summary

A radical tutorial on python that deletes 80% of the language and teaches how to use functions to do everything.  Object-oriented programming, exotic data structures, etc, are both ignored and actively discouraged because….YAGNI (You ain’t gonna need it).  Heavily based on real-world programming I do.

* Procedural Statements
* Lists and Dictionaries
* Functions
* Pattern Matching
* Lazy Expressions

2. Automating Text and Files

Summary

Use a combination of modern techniques and time tested patterns to deal with text.  This chapter covers everything from using regular expressions to find patterns, to using pre-trained NLP models and Pandas.

* Reading and Writing Files
* Using Regular Expressions to search Text
* Mixing Shell Commands with Subprocess 
* Dealing with large files
* Encrypting Text
* Vectorizing Text
* Searching and Indexing Text
* Using off the shell NLP Tools
* Integration with Logging Systems
* Using Pandas to deal with Text

3. Networking

Summary

Learn to do networking programming in Python.  Master the tradeoffs provided by cloud computing providers that translate to network performance and bottlenecks.  Finally, learn to master async network operations with Python 3.

* Understanding Network programming tradeoffs
* Using Async IO 
* Using Sockets
* Understanding the limitations of the cloud networking stack
* Monitoring and Instrumenting network code
* Using Async Logging

4. Automating the Filesystem

Learn to automate common file system operations including walking a directory and finding patterns. Useful tips like how to use cron to automate recurring tasks are covered.

Summary

* Managing files and directories using os.path
* Walking directory trees using os.walk
* Getting stat information on files and directories 
* Writing a cleanup script based on file access time
* Using the Cron facility to schedule jobs
* Utilizing Network File Systems for automation

5.  Package Management

Summary

Learn to master each unique package management challenge in this chapter.  Important topics like creating Python packages, and mastering common Linux package formats are broken down.  Development environment issues like homebrew, and configuring Bash and ZSH are also covered.

* Python package management
* Debian package management
* Red Hat package management
* Using Docker with package management
* OS X Homebrew
* Installer scripts
* Dealing with Systemd
* Using Bash and ZSH with packaging
* Writing cross-platform installers

6. Concurrency and Performance

Summary

Learn to master the right concurrency technique for the task at hand.  Learn to use the high performance computing library Numba to turbocharge you code with true threads, JIT and the GPU.  Learn to use FaaS (Function as a Service) to solve unique problems in an elegant way.

* Managing processes with Subprocess
* Using Asyncio for network parallelization
* Using Multiprocessing to solve problems
* FaaS (Function as a Service)
* Numba based parallelization
* True threads
* GPU programming
* Speeding up regular Python code with Numba JIT

7. Data Persistence

Summary

Learn to take a pragmatic approach to store data.   Common serialization formats are covered in detail to give you many options for dealing with messy problems in the real world.  Recipes for dealing with SQLite, Big Data and Key/Value databases finish off the chapter.

* Using common serialization formats
    * YAML
    * JSON
    * Pickle
    * CSV
* Using the Pandas Ecosystem
* Using SQLite
* Dealing with Big Data
* Using Key/Value databases

8. Command Line

Summary

Learn to use three levels of libraries to create command-line tools in Python:  sys.argv, click and argparse.  Learn to implement sophisticated plugins with your command line tools.  Finally, make peace with shell commands and Python by using them together to create powerful new patterns.

* Using sys.argv 
* Using click
* Using argparse
* Implementing plugins
* Mixing shell and Python together

9. Terraform
Summary

Hashicorp’s Terraform has revolutionized the category of Infrastructure As Code (IAC).  In this chapter, learn IAC concepts and explore Terraform and it’s configuration language (HCL).  Finally, dive into HCL basics and wrap the chapter up with advanced patterns.

* Modules
* Looping
* Branching
* Testing
* Python integration points

10. Imaging

Summary

Immutable infrastructure is a must for building large scale distributed systems.  Learn to create immutable machine images for cloud, VM, bare metal and containers.  Learn to create Golden Image (with Packer), and use Kickstart, and Debootstrap.

* Immutable infrastructure concepts
* Using Packer
* Using Kickstart
* Using Debootstrap
* Using Network File Systems with Images
* Distributed Systems and Images

11. Docker Containers

Summary

Learn to programmatically manipulate containers. Fully automate container lifecycles. The Docker daemon exposes a tremendous amount of interoperability through its API over a UNIX socket, which can be accessed easily with Python. This section will cover its usage and interactions, examples on what can be done via the socket and the Docker Python SDK. 

* Run containers
* Manage containers
* Manage swarms
* Use containers locally for development
* Customize containers  

12. Kubernetes

Summary

Kubernetes is has emerged as the preeminent workload scheduling platform.  Learn the high-level concepts of Kubernetes and dive into automation administration tasks with Python.

* Cluster administration
* Understanding cluster resources
* Manage clusters
* Upgrading clusters
* Resizing clusters
* Autoscale clusters

13. Operationalization

Summary

Learn to operationalize production software including Machine Learning and Big Data systems.  Learn to Implement alerting and monitoring to increase the reliability of a system.  Use industry standard instrumentation, logging, and load-testing best practices to get the best performance.

* Key concepts in building reliable systems
* Fault tolerance
* High Availability
* Monitoring
* Logging 
* Alerting
* Instrumentation
* Statsd
Prometheus
Async
Profiling
Load-Testing
Operationalizing Machine Learning and Big Data systems
Using multiple environments

14. Useful Linux utilities

Summary

Learn to use the best tools for the task at hand.  Mix Python along with Bash/ZSH to create unique solutions.  Use common disk, networking and CPU utilities to monitor the performance of a system at scale.

Disk Utilities
Network Utilities
CPU Utilities
Working with Bash and ZSH 
Mixing Python with Bash and ZSH
Python one liners

15. Build systems

Summary


Build systems are a critical component of DevOps based automation.  There are both SaaS-based build systems like AWS Code Build, CircleCI and Travis, and open source build systems like Jenkins. This chapter covers both.  Jenkins is a  powerful and popular continuous integration system that has a very powerful HTTP API allowing clients to create, delete, or modify different parts of the system. From Python, it is easy to produce ephemeral jobs and nodes depending on system demand, making it easy to scale out (or in) resources.  

Continuous Integration Why Do I Care?
Getting started with building software
Using Makefiles
SaaS Build Systems
Jenkins
Distributed Build Systems
Containers and build systems
Deploying from build systems

16. PyTest for DevOps

Summary

PyTest is considered the defacto Python testing framework.  It includes a test runner and an extensible API. Knowing how to write good unit tests is a great opportunity to ensure day to day operations are working as expected.  This can enhance the level of confidence when deploying or modifying infrastructure.  Usually, unit tests are meant to be run locally, with little to no interaction with outside resources. The `testinfra` project extends the PyTest testing framework to allow remote testing with a plethora of different types of connections and helpers.  This can answer questions like “is this daemon running on a remote node and listening on port 80?”. This sort of verification is a tremendous opportunity for an administrator to immediately catch things that aren’t quite right.   All of this is accomplished with the speed and resilience of system testing and powerful reporting.

Getting started with PyTest
Testing with PyTest
Using Fixtures with PyTest
Test-Infra Plugin
AWS Moto Integration
Terraform and PyTest
Build integration with PyTest
