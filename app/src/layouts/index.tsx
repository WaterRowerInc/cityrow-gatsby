import * as React from "react";
import PageLayout from "./PageLayout";

// eslint-disable-next-line react/display-name
export default ({ children, props }: { children: any; props: any }) => <PageLayout {...props}>{children}</PageLayout>;
