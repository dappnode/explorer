import React from "react";
import { GoPackage } from "react-icons/go";
import { MdUpdate } from "react-icons/md";
import { useCountQuery } from "generated/graphql";
import "./summary-stats.scss";

export default function SummaryStats() {
  const { data } = useCountQuery();

  const registries = data?.registries || [];
  const packageCount = registries.reduce(
    (total, reg) => total + reg.repoCount,
    0
  );
  const versionCount = registries.reduce(
    (total, reg) => total + reg.versionCount,
    0
  );

  const cards = [
    { title: "Published packages", stat: packageCount, Icon: GoPackage },
    { title: "Published versions", stat: versionCount, Icon: MdUpdate },
  ];

  return (
    <div className="summary-stats">
      {cards.map(({ title, stat, Icon }) => (
        <div key={title} className="card">
          <span className="title">{title}</span>
          <span className="stat">{stat}</span>
          <span className="icon">
            <Icon />
          </span>
        </div>
      ))}
    </div>
  );
}
