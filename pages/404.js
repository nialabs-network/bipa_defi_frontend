import React from "react";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return <main>CUSTOM 404 PAGE {t("dashboard")}</main>;
}
