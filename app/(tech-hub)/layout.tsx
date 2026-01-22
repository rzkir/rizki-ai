import { Fragment } from "react";

import Menu from "@/helper/menu/Menu";

export default function TechHubLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Fragment>
            <Menu />
            {children}
        </Fragment>
    );
}
