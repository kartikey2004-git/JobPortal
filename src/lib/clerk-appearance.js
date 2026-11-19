/**
 * Makes every Clerk component (sign-in, user menu, account modal) follow the app's design system.
 * Passed once to <ClerkProvider appearance={...}> so all Clerk UI inherits it.
 *
 * - `variables` map Clerk's palette to the design tokens (so light/dark follow `.dark`).
 * - `elements` apply the same Tailwind classes the app's own Button / Input / Card use.
 * - Borders and hover backgrounds use `--app-border` / `--app-accent` (styles/vendor.css) because
 *   Clerk shadows `--border` and `--accent` locally.
 * - `cssLayerName` puts Clerk's CSS in a layer below Tailwind's (see src/index.css), so these
 *   classes override Clerk's defaults without `!important`.
 */

// Same recipes as components/ui (Input, Button).
const control =
  "h-9 rounded-md border border-(color:--app-border) bg-transparent px-3 text-sm shadow-none transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-[3px] focus:ring-ring/50";
const primaryButton =
  "h-9 rounded-md bg-primary bg-none text-sm font-medium normal-case text-primary-foreground shadow-xs transition-colors after:hidden hover:bg-primary/85"; // after:hidden removes Clerk's gradient overlay
const outlineButton =
  "h-9 rounded-md border border-(color:--app-border) bg-background text-sm font-medium text-foreground shadow-none transition-colors hover:bg-(--app-accent)";

// Rows in the user menu (built-in and custom items share one look).
const menuItem =
  "h-9 gap-3 rounded-sm px-3 text-sm font-medium text-foreground transition-colors hover:bg-(--app-accent)";
const menuItemText = "text-sm font-medium text-foreground";
const menuItemIcon = "size-4 text-muted-foreground";

export const clerkAppearance = {
  cssLayerName: "clerk",
  variables: {
    colorPrimary: "var(--primary)",
    colorPrimaryForeground: "var(--primary-foreground)",
    colorTextOnPrimaryBackground: "var(--primary-foreground)",
    colorNeutral: "var(--foreground)",
    colorForeground: "var(--foreground)",
    colorMutedForeground: "var(--muted-foreground)",
    colorBorder: "var(--app-border)",
    colorInput: "var(--input)",
    colorBackground: "var(--popover)",
    colorText: "var(--foreground)",
    colorTextSecondary: "var(--muted-foreground)",
    colorInputBackground: "transparent",
    colorInputText: "var(--foreground)",
    colorDanger: "var(--destructive)",
    colorSuccess: "var(--success)",
    colorWarning: "var(--warning)",
    borderRadius: "0.5rem",
    fontFamily: "var(--font-geist-sans)",
    fontFamilyButtons: "var(--font-geist-sans)",
    fontSize: "0.875rem",
  },
  elements: {
    // Containers (match DialogContent: popover surface, hairline border, overlay shadow)
    cardBox: "overflow-hidden rounded-lg border border-(color:--app-border) bg-popover shadow-overlay",
    card: "bg-popover shadow-none",
    modalBackdrop: "bg-black/50",
    footer: "bg-transparent bg-none",

    // Header (match base.css headings: weight 450, tight tracking)
    headerTitle: "font-sans text-lg font-medium tracking-[-0.025em] text-foreground",
    headerSubtitle: "text-sm text-muted-foreground",

    // Social + divider
    socialButtonsBlockButton: outlineButton,
    socialButtonsBlockButtonText: "text-sm font-medium",
    providerIcon__github: "dark:invert",
    dividerLine: "bg-(color:--app-border)",
    dividerText: "text-xs text-muted-foreground",

    // Form
    formFieldLabel: "text-sm font-medium text-foreground",
    formFieldInput: control,
    formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
    formFieldErrorText: "text-sm text-destructive",
    formFieldSuccessText: "text-sm text-success",
    formFieldHintText: "text-xs text-muted-foreground",
    otpCodeFieldInput: `${control} h-10 w-10 px-0 text-center`,
    formButtonPrimary: primaryButton,
    formButtonReset: "h-9 rounded-md text-sm font-medium text-muted-foreground hover:bg-(--app-accent) hover:text-foreground",
    identityPreview: "rounded-md border border-(color:--app-border)",
    identityPreviewEditButton: "text-foreground",
    alert: "rounded-md border border-destructive/30 bg-destructive/5 text-sm",

    // Footer links
    footerActionText: "text-sm text-muted-foreground",
    footerActionLink: "text-sm font-medium text-foreground underline-offset-4 hover:underline",

    // User button + menu
    userButtonAvatarBox: "size-7",
    avatarBox: "size-7",
    userButtonPopoverCard: "rounded-md border border-(color:--app-border) bg-popover shadow-popover",
    userButtonPopoverMain: "gap-0",
    userButtonPopoverActions: "p-1",
    userButtonPopoverActionButton: menuItem,
    userButtonPopoverActionButtonText: menuItemText,
    userButtonPopoverActionButtonIcon: menuItemIcon,
    userButtonPopoverCustomItemButton: menuItem,
    userButtonPopoverCustomItemButtonText: menuItemText,
    userButtonPopoverCustomItemButtonIconBox: "flex size-4 items-center justify-center",
    userButtonPopoverCustomItemButtonIcon: menuItemIcon,
    userButtonPopoverFooter: "bg-transparent bg-none",
    userPreviewMainIdentifier: "text-sm font-medium text-foreground",
    userPreviewSecondaryIdentifier: "text-xs text-muted-foreground",

    // Account modal (UserProfile)
    navbar: "bg-transparent",
    navbarButton: "rounded-sm text-sm font-medium hover:bg-(--app-accent)",
    pageScrollBox: "bg-transparent",
    profileSection: "border-(color:--app-border)",
    profileSectionTitle: "border-(color:--app-border)",
    profileSectionTitleText: "text-sm font-medium",
    profileSectionPrimaryButton: "rounded-md text-sm font-medium hover:bg-(--app-accent)",
    menuButton: "rounded-sm hover:bg-(--app-accent)",
    menuList: "rounded-md border border-(color:--app-border) bg-popover shadow-popover",
    menuItem: "text-sm hover:bg-(--app-accent)",
    badge: "rounded-sm text-xs font-medium",
  },
};
