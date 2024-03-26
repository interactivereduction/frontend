import logoLight from './images/ir-light-text-logo.png';

export function createRoute(
  section: string,
  label: string,
  route: string,
  order: number,
  helpText: string,
  unauthorised: boolean
): void {
  // By default SciGateway will use logoDarkMode even when light mode is on.
  // Also, switching between light and dark doesn't alter the header bar
  // colour unless high contrast mode is also on, so for now only using the
  // light logo
  const pluginUrl = process.env.REACT_APP_PLUGIN_URL;
  const logoUrl = pluginUrl + logoLight;
  const routeAction = {
    type: 'scigateway:api:register_route',
    payload: {
      section: section,
      link: route,
      plugin: 'flexible-interactive-automation',
      displayName: label,
      order: order,
      helpText: helpText,
      unauthorised: unauthorised,
      logoLightMode: logoUrl,
      logoDarkMode: logoUrl,
      logoAltText: 'Interactive Reduction',
    },
  };
  document.dispatchEvent(new CustomEvent('scigateway', { detail: routeAction }));
}
