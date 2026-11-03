// Course visual aid on Azure: one Free-tier Static Web App in the course's own resource group.
// The resource group is created by a subscription owner and named in AZURE_RESOURCE_GROUP (rg-<environmentName>).
// Response headers come from public/staticwebapp.config.json in the deployed build.
targetScope = 'resourceGroup'

@minLength(1)
@maxLength(40)
@description('azd environment name, for example ai4cyber-101-prod. Names the app.')
param environmentName string

@allowed(['eastasia', 'westeurope', 'eastus2', 'centralus', 'westus2'])
@description('Static Web Apps region. Free tier is limited to these. Content is served from the global edge either way.')
param location string

resource web 'Microsoft.Web/staticSites@2024-04-01' = {
  name: 'stapp-${environmentName}'
  location: location
  tags: {
    'azd-env-name': environmentName
    'azd-service-name': 'web'
    course: 'ai-for-cybersecurity-101'
  }
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    provider: 'Custom'
    allowConfigFileUpdates: true
  }
}

output WEB_URI string = 'https://${web.properties.defaultHostname}'
