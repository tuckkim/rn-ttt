import React, { ReactElement } from "react";

import Navigator from "@config/navigator";
import { AppBoostrap } from "@components";

export default function App(): ReactElement {
  return (
    <AppBoostrap>
      <Navigator />
    </AppBoostrap>
  );
}
