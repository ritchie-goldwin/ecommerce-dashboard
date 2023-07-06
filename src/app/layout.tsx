/** @jsxImportSource @emotion/react */
"use client";

import {
  Refine,
  useLink,
  useRouterContext,
  useRouterType,
} from "@refinedev/core";
import dataProvider from "@refinedev/simple-rest";
import routerProvider from "@refinedev/nextjs-router/app";
import {
  RefineLayoutThemedTitleProps,
  RefineSnackbarProvider,
  ThemedLayoutV2,
} from "@refinedev/mui";
import { CssBaseline, GlobalStyles, Typography } from "@mui/material";
import { ColorModeContextProvider } from "@contexts";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { Inventory, ShoppingCart, Store } from "@mui/icons-material";
import MuiLink from "@mui/material/Link";
import { Header } from "src/app/components/header";

const API_URL = "https://dummyjson.com";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RefineKbarProvider>
          <ColorModeContextProvider>
            <CssBaseline />
            <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
            <RefineSnackbarProvider>
              <Refine
                dataProvider={dataProvider(API_URL)}
                routerProvider={routerProvider}
                // options={{
                //   syncWithLocation: true,
                //   warnWhenUnsavedChanges: true,
                // }}
                resources={[
                  {
                    name: "products",
                    list: "/products",
                    show: "/products/show/:id",
                    meta: {
                      icon: <Inventory />,
                    },
                  },
                  {
                    name: "carts",
                    list: "/carts",
                    show: "/carts/show/:id",
                    meta: {
                      icon: <ShoppingCart />,
                    },
                  },
                ]}
              >
                <ThemedLayoutV2
                  Title={LayoutTitle}
                  Header={() => <Header sticky />}
                >
                  {children}
                </ThemedLayoutV2>
                <RefineKbar />
              </Refine>
            </RefineSnackbarProvider>
          </ColorModeContextProvider>
        </RefineKbarProvider>
      </body>
    </html>
  );
}

const defaultTitle = "Dashboard";

function LayoutTitle({
  collapsed,
  wrapperStyles,
}: RefineLayoutThemedTitleProps) {
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

  return (
    <MuiLink
      to="/"
      component={ActiveLink}
      underline="none"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        ...wrapperStyles,
      }}
    >
      <Store width={24} height={24} color="primary" />
      {!collapsed && (
        <Typography
          variant="h6"
          fontWeight={700}
          color="text.primary"
          fontSize="inherit"
          textOverflow="ellipsis"
          overflow="hidden"
        >
          {defaultTitle}
        </Typography>
      )}
    </MuiLink>
  );
}
