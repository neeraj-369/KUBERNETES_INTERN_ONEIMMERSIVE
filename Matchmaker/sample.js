const tenantname = 'tenant-74334f-oidev';
var deploymentNamei = "mm-deployment" + cirrusServer.hash;
var serviceNamei = "mm-service" + cirrusServer.hash;
var ingressNamei = "mm-ingress" + cirrusServer.hash;


const k8sApi2 = kc.makeApiClient(k8s.AppsV1Api);
k8sApi2.deleteNamespacedDeployment(deploymentNamei, tenantname)
  .then(() => {
    console.log(`Deleted deployment: ${deploymentNamei}`);
  })
  .catch((error) => {
    console.error(`Error deleting deployment: ${error}`);
  });

const k8sApi3 = kc.makeApiClient(k8s.CoreV1Api);
k8sApi3.deleteNamespacedService(serviceNamei, tenantname)
  .then(() => {
    console.log(`Deleted service: ${serviceNamei}`);
  })
  .catch((error) => {
    console.error(`Error deleting service: ${error}`);
  });

const k8sApi4 = kc.makeApiClient(k8s.NetworkingV1Api);
k8sApi4.deleteNamespacedIngress(ingressNamei, tenantname)
  .then(() => {
    console.log(`Deleted ingress: ${ingressNamei}`);
  })
  .catch((error) => {
    console.error(`Error deleting ingress: ${error}`);
  });
  