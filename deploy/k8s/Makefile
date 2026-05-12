# Helper targets for Kubernetes deploys.
# All targets assume kubectl is configured for the target cluster.

NAMESPACE ?= helios-api
IMAGE     ?= ghcr.io/your-org/helios-api:latest

.PHONY: all namespace secrets apply rollout logs port-forward

all: namespace secrets apply rollout

namespace:
	kubectl get namespace $(NAMESPACE) >/dev/null 2>&1 || kubectl create namespace $(NAMESPACE)

# Create/update the env Secret from secrets.env (copy secrets.example.env → secrets.env first).
# This never places secret values on the shell command line or in shell history.
secrets:
	@test -f $(CURDIR)/secrets.env || (echo "ERROR: deploy/k8s/secrets.env not found. Copy secrets.example.env → secrets.env and fill values." && exit 1)
	kubectl create secret generic $(NAMESPACE)-env \
		--namespace $(NAMESPACE) \
		--from-env-file=$(CURDIR)/secrets.env \
		--dry-run=client -o yaml | kubectl apply -f -

apply:
	kubectl apply -f $(CURDIR)/deployment.yaml --namespace $(NAMESPACE)
	kubectl apply -f $(CURDIR)/service.yaml --namespace $(NAMESPACE)
	@test ! -f $(CURDIR)/hpa.yaml || kubectl apply -f $(CURDIR)/hpa.yaml --namespace $(NAMESPACE)

rollout:
	kubectl rollout status deployment/$(NAMESPACE) --namespace $(NAMESPACE)

logs:
	kubectl logs -f deployment/$(NAMESPACE) --namespace $(NAMESPACE)

port-forward:
	kubectl port-forward svc/$(NAMESPACE) 8080:80 --namespace $(NAMESPACE)
