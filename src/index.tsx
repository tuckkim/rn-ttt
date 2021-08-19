import React, { ReactElement } from "react";

import Navigator from "@config/navigator";
import { AppBoostrap } from "@components";
import { SettingsProvider } from "@contexts/settings-context";

export default function App(): ReactElement {
  return (
    <AppBoostrap>
      <SettingsProvider>
        <Navigator />
      </SettingsProvider>
    </AppBoostrap>
  );
}
