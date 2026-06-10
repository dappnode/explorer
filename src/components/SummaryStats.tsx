import React from "react";
import { GoPackage } from "react-icons/go";
import { MdLayers, MdUpdate } from "react-icons/md";
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
  const registryCount = registries.length;

  const cards = [
    {
      title: "Published packages",
      stat: packageCount,
      Icon: GoPackage,
      tone: "brand" as const,
    },
    {
      title: "Published versions",
      stat: versionCount,
      Icon: MdUpdate,
      tone: "accent" as const,
    },
    {
      title: "Active registries",
      stat: registryCount,
      Icon: MdLayers,
      tone: "muted" as const,
    },
  ];

  return (
    <div className="summary-stats">
      {cards.map(({ title, stat, Icon, tone }) => (
        <div key={title} className={`stat-card stat-card--${tone}`}>
          <div className="stat-card__icon">
            <Icon />
          </div>
          <div className="stat-card__body">
            <div className="stat-card__title">{title}</div>
            <div className="stat-card__stat">{stat}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
