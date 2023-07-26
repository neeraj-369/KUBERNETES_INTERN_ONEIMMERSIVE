// Copyright Epic Games, Inc. All Rights Reserved.
var enableRedirectionLinks = true;
var enableRESTAPI = true;
const session = require('express-session');
const k8s = require('@kubernetes/client-node');
const yaml = require('js-yaml');
const kubeconfigText = `
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUMvVENDQWVXZ0F3SUJBZ0lSQU9aYmIxbVZkUk5pbkVZd05aR3d5TGd3RFFZSktvWklodmNOQVFFTEJRQXcKR0RFV01CUUdBMVVFQXhNTlkyOXlaWGRsWVhabExtTnZiVEFlRncweU1UQTRNall3TURNeU1qWmFGdzB6TVRBNApNall4TWpNeU1qWmFNQmd4RmpBVUJnTlZCQU1URFdOdmNtVjNaV0YyWlM1amIyMHdnZ0VpTUEwR0NTcUdTSWIzCkRRRUJBUVVBQTRJQkR3QXdnZ0VLQW9JQkFRRFkra0FTSzFOZFdwNW5XdExBN05mSS9rc3k0cU9mOWVZRGNxb00KemppODFHQUJlenNFSjBFc1NVclhpSUd6Z29TYkV3L1BKQXZDZGRURXRlTWQ0RU93NnNTVWU4SFFHV1dxcTBmVgpvdzMwanJQcWxramEzSmZhWWJMWi9Pc3A2enZXbml3eXNTVmJlQmJFTlFFL2RuVDN4UmdTTFl3TlJGcDcwZnU1CkJqbW9MZjhjYzdFMlp0TkF1cHRRVUJiMzdLSnlJYlJYOTdnV3B0QnJPOXN0ZWFTMUkwcGNTSHBvYWFBYzBIbGgKYkRNZTQyYkxFbjFkQ0tud1ZEWnBRSVAvTFc0UGM4NmEvYTJDZzZnMmJCcWhTWFFPNzBybHZ0aXVGYmwrTDZoRApxZU14ckl5MmR1MWE1VU9HcU9iTDkwczIxVE0vR3F5MTRaQU1ndVhsTFlCajVIWi9BZ01CQUFHalFqQkFNQTRHCkExVWREd0VCL3dRRUF3SUNwREFQQmdOVkhSTUJBZjhFQlRBREFRSC9NQjBHQTFVZERnUVdCQlNKTUpNUDJnOHAKeGxUelB4Ulp4cFkyZEFOMVVUQU5CZ2txaGtpRzl3MEJBUXNGQUFPQ0FRRUFEQWYxb3R2Y1FzZjZVODN2b0RvSAo3ZVhnSUdPUVZoMzh6VlgwSzh5cUV1ampjcDRZZ0o2OXJoektsQ3A3SGlMZEdzV3dmRkc3b25NeUtxYUNHSWJnCmFHc1NzVU9nOHhxelJ1UEpJU2RDa3B6VVdualNmRW03dU5vRlJJd0x6UHFmZ2IrWnJRNEdSaGFQMkxudkFKZ1oKbVNCczZMeDdGWnk0R2xYdlQ1QUhaMnNvSHdSMnNONEFqNjdkcHFzVk80QUcyZk0remg5MGZHTkRhSWxVeFVySwoxNGlUVW9IUVVlU2FhcTIrdkdWYmhlK2lOVW9DNTVmV29oL2svVm1PSVdyRnFwTW5IeFdKditHakRTZ3Q0WldWCk1qTVdCNFZsbWlCbmpEM25ib0dZVHJGVXd5M21GV2hnejNIanpRNzF2bDVlTnFaRzFtVGwycTRFUTBScE5Sd1kKRGc9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==
    server: https://k8s.ord1.coreweave.com
  name: coreweave
contexts:
- context:
    cluster: coreweave
    namespace: tenant-74334f-oidev
    user: token-Kkn7HYfPzuXKApoTiaMk
  name: coreweave
current-context: coreweave
kind: Config
users:
- name: token-Kkn7HYfPzuXKApoTiaMk
  user:
    token: CHtnnc6xgtrQGH9pQ2P9cngsDCdzjpdQmfV7kF9C
`;

const crypto = require('crypto');

function generateRandomCode(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    randomCode += charset.charAt(randomIndex);
  }

  return randomCode;
}

const kc = new k8s.KubeConfig();
kc.loadFromString(kubeconfigText);
var k8sApi = kc.makeApiClient(k8s.AppsV1Api);
const targetNamespace = "tenant-74334f-oidev";

const jsonPod = {
	piVersion: 'v1',
	kind: 'Pod',
	metadata: {
	  name: 'pixel-streaming-pod',
	  labels: {
		app: 'app1'
	  }
	},
	spec: {
	  containers: [
		{
		  name: 'pixel-streaming-container',
		  image: 'gaddamvinay/repo:finalgame',
		  args: [
			'-PixelStreamingIp=app-service',
			'-PixelStreamingPort=8888'
		  ],
		  ports: [
			{
			  containerPort: 8888,
			  protocol: 'TCP'
			},
			{
			  containerPort: 8888,
			  protocol: 'UDP'
			}
		  ],
		  resources: {
			limits: {
			//   cpu: '4',
			//   memory: '1Gi',
			  'nvidia.com/gpu': 1
			}
		  }
		}
	  ]
	}
  };

  const jsonDeployment = {
	apiVersion: 'apps/v1',
	kind: 'Deployment',
	metadata: {
	  name: 'app-deployment',
	  labels: {
		app: 'app'
	  }
	},
	spec: {
	  replicas: 1,
	  selector: {
		matchLabels: {
		  app: 'app'
		}
	  },
	  template: {
		metadata: {
		  labels: {
			app: 'app'
		  }
		},
		spec: {
		  containers: [
			{
			  name: 'app-containers',
			  image: 'neerajpolavarapu/ss:ss',
			  args: [
				'coturn.tenant-74334f-oidev.lga1.ingress.coreweave.cloud:3478',
				'PixelStreamingUser',
				'AnotherTURNintheroad',
				"hash"
			  ],
			  ports: [
				{
				  containerPort: 8888,
				  protocol: 'TCP'
				},
				{
				  containerPort: 80,
				  protocol: 'TCP'
				},
				{
				  containerPort: 8888,
				  protocol: 'UDP'
				},
				{
				  containerPort: 80,
				  protocol: 'UDP'
				},
				{
				  containerPort: 9999,
				  protocol: 'UDP'
				},
				{
				  containerPort: 90,
				  protocol: 'UDP'
				},
				{
				  containerPort: 9999,
				  protocol: 'TCP'
				},
				{
				  containerPort: 90,
				  protocol: 'TCP'
				},
				{
				  containerPort: 3478,
				  protocol: 'TCP'
				},
				{
				  containerPort: 3478,
				  protocol: 'UDP'
				},
				{
				  containerPort: 3479,
				  protocol: 'TCP'
				},
				{
				  containerPort: 3479,
				  protocol: 'UDP'
				}
			  ]
			}
		  ]
		}
	  }
	}
  };
  


  const jsonService = {
	apiVersion: 'v1',
	kind: 'Service',
	metadata: {
	  name: 'app-service'
	},
	spec: {
	  selector: {
		app: 'app'
	  },
	  ports: [
		{
		  name: 'backend-port-tcp',
		  protocol: 'TCP',
		  port: 8888,
		  targetPort: 8888
		},
		{
		  name: 'backend-port-udp',
		  protocol: 'UDP',
		  port: 8888,
		  targetPort: 8888
		},
		{
		  name: 'frontend-port-tcp',
		  protocol: 'TCP',
		  port: 80,
		  targetPort: 80
		},
		{
		  name: 'frontend-port-udp',
		  protocol: 'UDP',
		  port: 80,
		  targetPort: 80
		},
		{
		  name: 'backend-port-tcp1',
		  protocol: 'TCP',
		  port: 9999,
		  targetPort: 9999
		},
		{
		  name: 'backend-port-udp1',
		  protocol: 'UDP',
		  port: 9999,
		  targetPort: 9999
		},
		{
		  name: 'frontend-port-tcp1',
		  protocol: 'TCP',
		  port: 90,
		  targetPort: 90
		},
		{
		  name: 'frontend-port-udp1',
		  protocol: 'UDP',
		  port: 90,
		  targetPort: 90
		},
		{
		  name: 'p1',
		  protocol: 'UDP',
		  port: 3478,
		  targetPort: 3478
		},
		{
		  name: 'p2',
		  protocol: 'UDP',
		  port: 3479,
		  targetPort: 3479
		},
		{
		  name: 'pp1',
		  protocol: 'TCP',
		  port: 3478,
		  targetPort: 3478
		},
		{
		  name: 'pp2',
		  protocol: 'TCP',
		  port: 3479,
		  targetPort: 3479
		}
	  ],
	  type: 'ClusterIP'
	}
  };
  

  const jsonIngress = {
	apiVersion: 'networking.k8s.io/v1',
	kind: 'Ingress',
	metadata: {
	  name: 'app-ingress'
	},
	spec: {
	  rules: [
		{
		  host: '.tenant-74334f-oidev.lga1.ingress.coreweave.cloud',
		  http: {
			paths: [
			  {
				path: '/',
				pathType: 'Prefix',
				backend: {
				  service: {
					name: 'app-service',
					port: {
					  number: 80
					}
				  }
				}
			  }
			]
		  }
		}
	  ]
	}
  };
  



const defaultConfig = {
	// The port clients connect to the matchmaking service over HTTP
	HttpPort: 80,
	UseHTTPS: false,
	// The matchmaking port the signaling service connects to the matchmaker
	MatchmakerPort: 9999,
	// Log to file
	LogToFile: true
};

// Similar to the Signaling Server (SS) code, load in a config.json file for the MM parameters
const argv = require('yargs').argv;
var configFile = (typeof argv.configFile != 'undefined') ? argv.configFile.toString() : 'config.json';
// console.log(`configFile ${configFile}`);
const config = require('./modules/config.js').init(configFile, defaultConfig);
// console.log("Config: " + JSON.stringify(config, null, '\t'));
const express = require('express');
var cors = require('cors');
const app = express();
const http = require('http').Server(app);
const fs = require('fs');
const path = require('path');
const logging = require('./modules/logging.js');
logging.RegisterConsoleLogger();

if (config.LogToFile) {
	logging.RegisterFileLogger('./logs');
}

// A list of all the Cirrus server which are connected to the Matchmaker.
var cirrusServers = new Map();

//
// Parse command line.
//

if (typeof argv.HttpPort != 'undefined') {
	config.HttpPort = argv.HttpPort;
}
if (typeof argv.MatchmakerPort != 'undefined') {
	config.MatchmakerPort = argv.MatchmakerPort;
}

http.listen(config.HttpPort, () => {
    console.log('HTTP listening on *:' + config.HttpPort);
});


if (config.UseHTTPS) {
	//HTTPS certificate details
	const options = {
		key: fs.readFileSync(path.join(__dirname, './certificates/client-key.pem')),
		cert: fs.readFileSync(path.join(__dirname, './certificates/client-cert.pem'))
	};

	var https = require('https').Server(options, app);

	//Setup http -> https redirect
	console.log('Redirecting http->https');
	app.use(function (req, res, next) {
		if (!req.secure) {
			if (req.get('Host')) {
				var hostAddressParts = req.get('Host').split(':');
				var hostAddress = hostAddressParts[0];
				if (httpsPort != 443) {
					hostAddress = `${hostAddress}:${httpsPort}`;
				}
				return res.redirect(['https://', hostAddress, req.originalUrl].join(''));
			} else {
				console.error(`unable to get host name from header. Requestor ${req.ip}, url path: '${req.originalUrl}', available headers ${JSON.stringify(req.headers)}`);
				return res.status(400).send('Bad Request');
			}
		}
		next();
	});

	https.listen(443, function () {
		console.log('Https listening on 443');
	});
}

var message = "";
// No servers are available so send some simple JavaScript to the client to make
// it retry after a short period of time.
function sendRetryResponse(res, hash) {
	// res.send(`All ${cirrusServers.size} Cirrus servers are in use. Retrying in <span id="countdown">3</span> seconds.
	res.send(`
	<html>
<head>
    <title>Combined HTML and CSS Cube Example</title>

    <style>

        * {
            font-family: "Albert Sans", sans-serif;
            font-size: inherit;
        }


        body {
            background-color: #ff8484ff;
            height: 100vh;
            display: grid;
            place-items: center;
            position: relative;
        }

        .scene {
            position: relative;
            z-index: 2;
            height: 220px;
            width: 220px;
            display: grid;
            place-items: center;
        }

        .cube-wrapper {
            transform-style: preserve-3d;
            animation: bouncing 2s infinite;
        }

        .cube {
            transform-style: preserve-3d;
            transform: rotateX(45deg) rotateZ(45deg);
            animation: rotation 2s infinite;
        }

		div.container {
			background-color: #ffffff;
			}
			div.container p {
			font-family: Times;
			font-size: 14px;
			font-style: normal;
			font-weight: normal;
			text-decoration: none;
			text-transform: none;
			color: #000000;
			background-color: #ffffff;
			}
        .cube-faces {
            transform-style: preserve-3d;
            height: 80px;
            width: 80px;
            position: relative;
            transform-origin: 0 0;
            transform: translateX(0) translateY(0) translateZ(-40px);
        }
        .cube-face {
            position: absolute;
            inset: 0;
            background: #110d31ff;
            border: solid 1px #ff8484ff;
        }
        .cube-face.shadow {
            transform: translateZ(-80px);
            animation: bouncing-shadow 2s infinite;
        }
        .cube-face.top {
            transform: translateZ(80px);
        }
        .cube-face.front {
            transform-origin: 0 50%;
            transform: rotateY(-90deg);
        }
        .cube-face.back {
            transform-origin: 0 50%;
            transform: rotateY(-90deg) translateZ(-80px);
        }
        .cube-face.right {
            transform-origin: 50% 0;
            transform: rotateX(-90deg) translateY(-80px);
        }
        .cube-face.left {
            transform-origin: 50% 0;
            transform: rotateX(-90deg) translateY(-80px) translateZ(80px);
        }
        @keyframes rotation {
            0% {
                transform: rotateX(45deg) rotateY(0) rotateZ(45deg);
                animation-timing-function: cubic-bezier(0.17, 0.84, 0.44, 1);
            }
            50% {
                transform: rotateX(45deg) rotateY(0) rotateZ(225deg);
                animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
            }
            100% {
                transform: rotateX(45deg) rotateY(0) rotateZ(405deg);
                animation-timing-function: cubic-bezier(0.17, 0.84, 0.44, 1);
            }
        }

        @keyframes bouncing {
            0% {
                transform: translateY(-40px);
                animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
            }
            45% {
                transform: translateY(40px);
                animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
            }
            100% {
                transform: translateY(-40px);
                animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
            }
        }

        @keyframes bouncing-shadow {
            0% {
                transform: translateZ(-80px) scale(1.3);
                animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
                opacity: 0.05;
            }
            45% {
                transform: translateZ(0);
                animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                opacity: 0.3;
            }
            100% {
                transform: translateZ(-80px) scale(1.3);
                animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
                opacity: 0.05;
            }
        }
    </style>
</head>
<body>
    <div class="scene">
        <div class="cube-wrapper">
            <div class="cube">
                <div class="cube-faces">
                    <div class="cube-face shadow"></div>
                    <div class="cube-face bottom"></div>
                    <div class="cube-face top"></div>
                    <div class="cube-face left"></div>
                    <div class="cube-face right"></div>
                    <div class="cube-face back"></div>
                    <div class="cube-face front"></div>
                </div>
            </div>
        </div>
		<div>
		<br>
		<br>
		<br>
		<br>
		<br>
		LOADING....
		<br>
		(${hash})
		<br>
		<span id="countdown"></span>
		</div>
    </div>
</body>
</html>
<script>
const hash = "${hash}"; // Replace with the actual hash value

setTimeout(() => {
	checkPodCreationStatus();
}, 3000);

function checkPodCreationStatus() {
  fetch('/check-pod-creation-status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ hash }) // Send the hash value in the request body
  })
    .then(response => response.json())
    .then(data => {
      if (data.podCreated && data.deploymentCreated && data.serviceCreated && data.ingressCreated) {
        // All pod creation operations are completed
        window.location.href = "http://game" + "${hash}" +".tenant-74334f-oidev.lga1.ingress.coreweave.cloud/";
      } else {
        // Retry after a delay if any pod creation operation is still pending
        setTimeout(checkPodCreationStatus, 2000); // Retry after 5 seconds
      }
    })
    .catch(error => {
      console.error('Error checking pod creation status:', error);
    });
}
</script>`);
}

app.get('/delayed-redirect', (req, res) => {
	const redirectUrl = "timeapp.tenant-74334f-oidev.lga1.ingress.coreweave.cloud/" + hash;
	res.redirect(redirectUrl)
});

// Get a Cirrus server if there is one available which has no clients connected.
function getAvailableCirrusServer() {
	for (cirrusServer of cirrusServers.values()) {
		if (cirrusServer.numConnectedClients === 0 && cirrusServer.ready === true) {
			// Check if we had at least 10 seconds since the last redirect, avoiding the 
			// chance of redirecting 2+ users to the same SS before they click Play.
			// In other words, give the user 10 seconds to click play button the claim the server.
			if( cirrusServer.hasOwnProperty('lastRedirect')) {
				if( ((Date.now() - cirrusServer.lastRedirect) / 1000) < 10 )
					continue;
			}
			cirrusServer.lastRedirect = Date.now();
			return cirrusServer;
		}
	}
	console.log('WARNING: No empty Cirrus servers are available');
	return undefined;
}

function sleep(time){
	return new Promise((resolve)=>setTimeout(resolve,time)
  )
}

if(enableRESTAPI) {
	// Handle REST signalling server only request.
	app.options('/signallingserver', cors())
	app.get('/signallingserver', cors(),  (req, res) => {
		cirrusServer = getAvailableCirrusServer();
		if (cirrusServer != undefined) {
			res.json({ signallingServer: `${cirrusServer.address}:${cirrusServer.port}`});
			console.log(`Returning ${cirrusServer.address}:${cirrusServer.port}`);
		} else {
			res.json({ signallingServer: '', error: 'No signalling servers available'});
		}
	});
}
function checkPodStatus(podName, tenantName) {
	return new Promise((resolve, reject) => {
	  const k8sApipp = kc.makeApiClient(k8s.CoreV1Api);
	  const checkStatus = () => {
		k8sApipp.readNamespacedPodStatus(podName, tenantName)
		  .then((res) => {
			const podStatus = res.body.status.phase;
			console.log(`Current status of ${podName}: ${podStatus}`);
			if (podStatus === 'Running') {
			  console.log(`Pod ${podName} in ${tenantName} is now Running`);
			  resolve(1); // Resolve the promise with status 1
			} else {
			  setTimeout(checkStatus, 500); // Continue checking after 5 seconds
			}
		  })
		  .catch((error) => {
			console.error('Error occurred while checking pod status:', error);
			reject(error); // Reject the promise with the error
		  });
	  };
	  checkStatus(); // Start checking pod status
	});
  }

function checkDeploymentStatus(deploymentName, namespace) {
	return new Promise((resolve, reject) => {
	  const k8sApidd = kc.makeApiClient(k8s.AppsV1Api);
	  k8sApidd.readNamespacedDeploymentStatus(deploymentName, namespace)
		.then((res) => {
		  const deploymentStatus = res.body.status;
		  const availableReplicas = deploymentStatus.availableReplicas || 0;
		  const desiredReplicas = deploymentStatus.replicas || 0;
		  console.log(`Current status of ${deploymentName} in ${namespace}: ${availableReplicas}/${desiredReplicas}`);
		  
		  if (availableReplicas === desiredReplicas) {
			console.log(`Deployment ${deploymentName} in ${namespace} is now available`);
			resolve(1); // Resolve the promise with status 1
		  } else {
			console.log("Deployment not available yet");
			resolve(0); // Resolve the promise with status 0
		  }
		})
		.catch((error) => {
		  console.error('Error occurred while checking deployment status:', error);
		  reject(error); // Reject the promise with the error
		});
	});
  }

const namespace = 'tenant-74334f-oidev';

app.use(express.json());
app.post('/check-pod-creation-status', (req, res) => {
	const { hash } = req.body; // Retrieve the hash value from the request body
	const pp = "pixel-streaming-pod" + hash;
	const dd = "app-deployment" + hash;
	var podCreated = 0;
  
	checkPodStatus(pp, namespace)
	  .then((status) => {
		podCreated = status;
		var deploymentCreated = 0;
		checkDeploymentStatus(dd, namespace)
		  .then((statusi) => {
			deploymentCreated = statusi;
  
			const serviceCreated = 1; // checkServiceStatus(hash); // Implement the logic to check service creation status using the hash value
			const ingressCreated = 1; // checkIngressStatus(hash); // Implement the logic to check ingress creation status using the hash value
  
			console.log(deploymentCreated);
			res.json({
			  podCreated,
			  deploymentCreated,
			  serviceCreated,
			  ingressCreated
			});
		  })
		  .catch((error) => {
			console.error('Error occurred while checking deployment status:', error);
			res.status(500).json({ error: 'An error occurred while checking the deployment status.' });
		  });
	  })
	  .catch((error) => {
		console.error('Error occurred while checking pod status:', error);
		res.status(500).json({ error: 'An error occurred while checking the pod status.' });
   });
});

app.use(session({
	secret: 'your-secret-key',
	resave: false,
	saveUninitialized: true
}));
if(enableRedirectionLinks) {
	app.get('/', (req, res) => {
		if (!req.session.greeted) {
			req.session.greeted = true; 
			var hash = "-" + generateRandomCode(15);
			req.session.hash = hash;
			sendRetryResponse(res, hash);
			jsonPod.metadata.name = 'pixel-streaming-pod' + hash;
			jsonPod.metadata.labels.app = 'app1' + hash;
			jsonPod.spec.containers[0].name = 'pixel-streaming-container' + hash;
			jsonPod.spec.containers[0].args[0] = '-PixelStreamingIp=app-service' + hash;
			jsonDeployment.metadata.name = 'app-deployment' + hash;
			jsonDeployment.metadata.labels.app = 'app' + hash;
			jsonDeployment.spec.selector.matchLabels.app = 'app' + hash;
			jsonDeployment.spec.template.metadata.labels.app = 'app' + hash;
			jsonDeployment.spec.template.spec.containers[0].name = 'app-containers' + hash;
			jsonDeployment.spec.template.spec.containers[0].args[3] = hash;
			jsonService.metadata.name = 'app-service' + hash;
			jsonService.spec.selector.app = 'app' + hash;
			jsonIngress.metadata.name = 'app-ingress' + hash;
			jsonIngress.spec.rules[0].host = "game" + hash + ".tenant-74334f-oidev.lga1.ingress.coreweave.cloud";
			jsonIngress.spec.rules[0].http.paths[0].backend.service.name = 'app-service' + hash;
			const podName = 'pixel-streaming-pod' + hash;
			const deploymentName = 'app-deployment' + hash;
			const k8sApid = kc.makeApiClient(k8s.CoreV1Api);
			k8sApid.createNamespacedPod(namespace, jsonPod).then((res) => {checkPodStatus(podName, namespace)});
			const k8sApia = kc.makeApiClient(k8s.AppsV1Api);
			k8sApia.createNamespacedDeployment(namespace, jsonDeployment).then((res) => {checkDeploymentStatus(deploymentName, namespace);});
			const k8sApib = kc.makeApiClient(k8s.CoreV1Api);
			k8sApib.createNamespacedService(namespace, jsonService);
			const k8sApic = kc.makeApiClient(k8s.NetworkingV1Api);
			k8sApic.createNamespacedIngress(namespace, jsonIngress);
		}
		else {
			var hash = req.session.hash;
			deploymentNamei = "app-deployment" + hash;
			const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
			const tenantname = 'tenant-74334f-oidev';
			var stat = 0;
			k8sApi.readNamespacedDeploymentStatus(deploymentNamei, tenantname)
			  .then(response => {
				const deploymentStatus = response.body.status;
				if (deploymentStatus.conditions) {
				  const terminatingCondition = deploymentStatus.conditions.find(
					condition => condition.type === "Progressing" && condition.reason === "ProgressDeadlineExceeded"
				  );
				  if (terminatingCondition) {
					stat = 0;
					req.session.greeted = true; 
					var hash = "-" + generateRandomCode(15);
					req.session.hash = hash;
					sendRetryResponse(res, hash);
					jsonPod.metadata.name = 'pixel-streaming-pod' + hash;
					jsonPod.metadata.labels.app = 'app1' + hash;
					jsonPod.spec.containers[0].name = 'pixel-streaming-container' + hash;
					jsonPod.spec.containers[0].args[0] = '-PixelStreamingIp=app-service' + hash;
					jsonDeployment.metadata.name = 'app-deployment' + hash;
					jsonDeployment.metadata.labels.app = 'app' + hash;
					jsonDeployment.spec.selector.matchLabels.app = 'app' + hash;
					jsonDeployment.spec.template.metadata.labels.app = 'app' + hash;
					jsonDeployment.spec.template.spec.containers[0].name = 'app-containers' + hash;
					jsonDeployment.spec.template.spec.containers[0].args[3] = hash;
					jsonService.metadata.name = 'app-service' + hash;
					jsonService.spec.selector.app = 'app' + hash;
					jsonIngress.metadata.name = 'app-ingress' + hash;
					jsonIngress.spec.rules[0].host = "game" + hash + ".tenant-74334f-oidev.lga1.ingress.coreweave.cloud";
					jsonIngress.spec.rules[0].http.paths[0].backend.service.name = 'app-service' + hash;
					const podName = 'pixel-streaming-pod' + hash;
					const deploymentName = 'app-deployment' + hash;
					const k8sApid = kc.makeApiClient(k8s.CoreV1Api);
					k8sApid.createNamespacedPod(namespace, jsonPod).then((res) => {checkPodStatus(podName, namespace)});
					const k8sApia = kc.makeApiClient(k8s.AppsV1Api);
					k8sApia.createNamespacedDeployment(namespace, jsonDeployment).then((res) => {checkDeploymentStatus(deploymentName, namespace);});
					const k8sApib = kc.makeApiClient(k8s.CoreV1Api);
					k8sApib.createNamespacedService(namespace, jsonService);
					const k8sApic = kc.makeApiClient(k8s.NetworkingV1Api);
					k8sApic.createNamespacedIngress(namespace, jsonIngress);
				  } else {
					stat = 1;
					var hash = req.session.hash;
					sendRetryResponse(res, hash);
				  }
				} else {
				  stat = 0;
				  req.session.greeted = true; 
				  var hash = "-" + generateRandomCode(15);
				  req.session.hash = hash;
				  sendRetryResponse(res, hash);
				  jsonPod.metadata.name = 'pixel-streaming-pod' + hash;
				  jsonPod.metadata.labels.app = 'app1' + hash;
				  jsonPod.spec.containers[0].name = 'pixel-streaming-container' + hash;
				  jsonPod.spec.containers[0].args[0] = '-PixelStreamingIp=app-service' + hash;
				  jsonDeployment.metadata.name = 'app-deployment' + hash;
				  jsonDeployment.metadata.labels.app = 'app' + hash;
				  jsonDeployment.spec.selector.matchLabels.app = 'app' + hash;
				  jsonDeployment.spec.template.metadata.labels.app = 'app' + hash;
				  jsonDeployment.spec.template.spec.containers[0].name = 'app-containers' + hash;
				  jsonDeployment.spec.template.spec.containers[0].args[3] = hash;
				  jsonService.metadata.name = 'app-service' + hash;
				  jsonService.spec.selector.app = 'app' + hash;
				  jsonIngress.metadata.name = 'app-ingress' + hash;
				  jsonIngress.spec.rules[0].host = "game" + hash + ".tenant-74334f-oidev.lga1.ingress.coreweave.cloud";
				  jsonIngress.spec.rules[0].http.paths[0].backend.service.name = 'app-service' + hash;
				  const podName = 'pixel-streaming-pod' + hash;
				  const deploymentName = 'app-deployment' + hash;
				  const k8sApid = kc.makeApiClient(k8s.CoreV1Api);
				  k8sApid.createNamespacedPod(namespace, jsonPod).then((res) => {checkPodStatus(podName, namespace)});
				  const k8sApia = kc.makeApiClient(k8s.AppsV1Api);
				  k8sApia.createNamespacedDeployment(namespace, jsonDeployment).then((res) => {checkDeploymentStatus(deploymentName, namespace);});
				  const k8sApib = kc.makeApiClient(k8s.CoreV1Api);
				  k8sApib.createNamespacedService(namespace, jsonService);
				  const k8sApic = kc.makeApiClient(k8s.NetworkingV1Api);
				  k8sApic.createNamespacedIngress(namespace, jsonIngress);
				}
			});


		}
}

);
	// Handle URL with custom HTML.
	// app.get('/custom_html/:htmlFilename', (req, res) => {
	// 	cirrusServer = getAvailableCirrusServer();
	// 	if (cirrusServer != undefined) {
	// 		res.redirect(`http://${cirrusServer.address}:${cirrusServer.port}/custom_html/${req.params.htmlFilename}`);
	// 		console.log(`Redirect to ${cirrusServer.address}:${cirrusServer.port}`);
	// 	} else {
	// 		sendRetryResponse(res);
	// 	}
	// });
}

//
// Connection to Cirrus.
//

function wait(ms){
	var start = new Date().getTime();
	var end = start;
	while(end < start + ms) {
	  end = new Date().getTime();
   }
}

const net = require('net');
function disconnect(connection) {
	console.log(`Ending connection to remote address ${connection.remoteAddress}`);
	connection.end();
}

const matchmaker = net.createServer((connection) => {
	connection.on('data', (data) => {
		try {
			message = JSON.parse(data);
			if(message)
				console.log(`Message TYPE: ${message.type}`);
		} catch(e) {
			console.log(`ERROR (${e.toString()}): Failed to parse Cirrus information from data: ${data.toString()}`);
			disconnect(connection);
			return;
		}
		if (message.type === 'connect') {
			// A Cirrus server connects to this Matchmaker server.
			cirrusServer = {
				address: message.address,
				port: message.port,
				numConnectedClients: 0,
				hash: message.hash,
				lastPingReceived: Date.now()
			};
			cirrusServer.ready = message.ready === true;
			// Handles disconnects between MM and SS to not add dupes with numConnectedClients = 0 and redirect users to same SS
			// Check if player is connected and doing a reconnect. message.playerConnected is a new variable sent from the SS to
			// help track whether or not a player is already connected when a 'connect' message is sent (i.e., reconnect).
			if(message.playerConnected == true) {
				cirrusServer.numConnectedClients = 1;
			}

			// Find if we already have a ciruss server address connected to (possibly a reconnect happening)
			let server = [...cirrusServers.entries()].find(([key, val]) => val.address === cirrusServer.address && val.port === cirrusServer.port);

			// if a duplicate server with the same address isn't found -- add it to the map as an available server to send users to.
			if (!server || server.size <= 0) {
				console.log(`Adding connection for ${cirrusServer.address.split(".")[0]} with playerConnected: ${message.playerConnected}`)
				cirrusServers.set(connection, cirrusServer);
            } else {
				console.log(`RECONNECT: cirrus server address ${cirrusServer.address.split(".")[0]} already found--replacing. playerConnected: ${message.playerConnected}`)
				var foundServer = cirrusServers.get(server[0]);

				// Make sure to retain the numConnectedClients from the last one before the reconnect to MM
				if (foundServer) {					
					cirrusServers.set(connection, cirrusServer);
					console.log(`Replacing server with original with numConn: ${cirrusServer.numConnectedClients}`);
					cirrusServers.delete(server[0]);
				} else {
					cirrusServers.set(connection, cirrusServer);
					console.log("Connection not found in Map() -- adding a new one");
				}
			}
		} else if (message.type === 'streamerConnected') {
			// The stream connects to a Cirrus server and so is ready to be used
			cirrusServer = cirrusServers.get(connection);
			if(cirrusServer) {
				cirrusServer.ready = true;
				console.log(`Cirrus server ${cirrusServer.address}:${cirrusServer.port} ready for use`);
			} else {
				disconnect(connection);
			}
		} else if (message.type === 'streamerDisconnected') {
			// The stream connects to a Cirrus server and so is ready to be used
			cirrusServer = cirrusServers.get(connection);
			if(cirrusServer) {
				cirrusServer.ready = false;
				console.log(`Cirrus server ${cirrusServer.address}:${cirrusServer.port} no longer ready for use`);
			} else {
				disconnect(connection);
			}
		} else if (message.type === 'clientConnected') {
			// A client connects to a Cirrus server.
			cirrusServer = cirrusServers.get(connection);
			if(cirrusServer) {
				cirrusServer.numConnectedClients++;
				console.log(`Client connected to Cirrus server ${cirrusServer.address}:${cirrusServer.port}`);
			} else {
				disconnect(connection);
			}
		} else if (message.type === 'clientDisconnected') {
			// A client disconnects from a Cirrus server.
			cirrusServer = cirrusServers.get(connection);
			if(cirrusServer) {
				cirrusServer.numConnectedClients--;
				console.log(`Client disconnected from Cirrus server ${cirrusServer.address}:${cirrusServer.port}`);
				if(cirrusServer.numConnectedClients === 0) {
					const tenantname = 'tenant-74334f-oidev';
					const k8sApi1 = kc.makeApiClient(k8s.CoreV1Api);
					podNamei = "pixel-streaming-pod" + cirrusServer.hash;
					deploymentNamei = "app-deployment" + cirrusServer.hash;
					serviceNamei = "app-service" + cirrusServer.hash;
					ingressNamei = "app-ingress" + cirrusServer.hash;
					k8sApi1.deleteNamespacedPod(podNamei, tenantname)
					const k8sApi2 = kc.makeApiClient(k8s.AppsV1Api);
					k8sApi2.deleteNamespacedDeployment(deploymentNamei, tenantname);
					const k8sApi3 = kc.makeApiClient(k8s.CoreV1Api);
					k8sApi3.deleteNamespacedService(serviceNamei, namespace);
					const k8sApi4 = kc.makeApiClient(k8s.NetworkingV1Api);
					k8sApi4.deleteNamespacedIngress(ingressNamei, namespace);
					// this make this server immediately available for a new client
					cirrusServer.lastRedirect = 0;
				}
			} else {
				disconnect(connection);
			}
		} else if (message.type === 'ping') {
			cirrusServer = cirrusServers.get(connection);
			if(cirrusServer) {
				cirrusServer.lastPingReceived = Date.now();
			} else {				
				disconnect(connection);
			}
		} else {
			console.log('ERROR: Unknown data: ' + JSON.stringify(message));
			disconnect(connection);
		}
	});
	// A Cirrus server disconnects from this Matchmaker server.
	connection.on('error', () => {
		cirrusServer = cirrusServers.get(connection);
		if(cirrusServer) {
			cirrusServers.delete(connection);
			console.log(`Cirrus server ${cirrusServer.address}:${cirrusServer.port} disconnected from Matchmaker`);
		} else {
			console.log(`Disconnected machine that wasn't a registered cirrus server, remote address: ${connection.remoteAddress}`);
		}
	});
});


matchmaker.listen(config.MatchmakerPort, () => {
	console.log('Matchmaker listening on *:' + config.MatchmakerPort);
});


