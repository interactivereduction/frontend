import logoLight from './images/ir-light-text-logo.svg';

export function createRoute(
  section: string,
  label: string,
  route: string,
  order: number,
  helpText: string,
  unauthorised: boolean
): void {
  const routeAction = {
    type: 'scigateway:api:register_route',
    payload: {
      section: section,
      link: route,
      plugin: 'demo_plugin',
      displayName: label,
      order: order,
      helpText: helpText,
      unauthorised: unauthorised,
      // By default SciGateway will use logoDarkMode but can't see the dark mode
      // logo because it's on a blue background
      logoLightMode: 'http://localhost:5001/' + logoLight,
      logoDarkMode: 'http://localhost:5001/' + logoLight,
      logoAltText: 'Interactive Reduction',
    },
  };
  document.dispatchEvent(
    new CustomEvent('scigateway', { detail: routeAction })
  );
}
