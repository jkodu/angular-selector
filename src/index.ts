import { AngularSelectorOnSteroids } from "./components/selector";

export const Init = debug => {
  return new AngularSelectorOnSteroids().BootUp(debug);
};
