#!/usr/bin/python
import os
os.system("git add . " +
	"&& git commit -m 'update'" +
	"&& git push origin master" +
	"&& ssh -i al.pem ubuntu@ec2-54-165-181-175.compute-1.amazonaws.com 'python deploy.py'")
