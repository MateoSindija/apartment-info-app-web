import React from "react";
import { FaPlus } from "react-icons/fa";
import { child } from "@firebase/database";
interface IProps {
  title: string;
  children?: JSX.Element;
  entriesNumber?: number;
}
const PageHeader = ({ title, entriesNumber, children }: IProps) => {
  return (
    <div className={"pageHeader"}>
      <div className={"pageHeader__title"}>
        {title}
        {entriesNumber !== undefined && (
          <div className={"pageHeader__title__subHeader"}>
            {entriesNumber} entries found
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default PageHeader;
