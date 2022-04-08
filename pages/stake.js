import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AppLayout from "../Components/Layouts/AppLayout";

export default function stake() {
  const { t, ready } = useTranslation();
  console.log(ready);
  return <main>stake{t("dashboard")}</main>;
}
