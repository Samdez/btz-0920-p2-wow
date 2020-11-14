import { Button, UncontrolledCollapse } from 'reactstrap';
import { BsThreeDotsVertical } from 'react-icons/bs';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';

import FactionIcons from './flags/FactionIcons';
import pjArrayContext from '../contexts/pjArray';
import DalApi from '../dal/DalApi';

function ToolsFilters({ results, playerClass }) {
  const { setFilterRes, setCurrentPage } = useContext(pjArrayContext);

  const [activeFactions, setActiveFactions] = useState([]);
  const [activeSpecs, setActiveSpecs] = useState([]);
  const [specs] = useState(DalApi.getClassesAndSpecsByName(playerClass).specs);
  const [factions] = useState(DalApi.getFactions());

  useEffect(() => {
    let tabTemp = results;
    // first filter faction : 0 selected = all. can clic or unclic a faction and multi select
    tabTemp = tabTemp.filter((elmt) => {
      return (
        activeFactions.indexOf(elmt.character.faction) !== -1 ||
        activeFactions === 0
      );
    });

    // second filter specs : 0 selected = all. can select or unselect a spec and multi select
    tabTemp = tabTemp.filter((elmt) => {
      return (
        activeSpecs.indexOf(elmt.character.spec.name) !== -1 ||
        activeSpecs.length === 0
      );
    });

    // display update
    setFilterRes(tabTemp);

    // in case of after filtering, total of pages > currentPage
    setCurrentPage(1);
  }, [activeFactions, activeSpecs]);

  return (
    <>
      <Button color="primary" id="toggler" style={{ marginBottom: '1rem' }}>
        <BsThreeDotsVertical />
      </Button>
      <UncontrolledCollapse toggler="#toggler">
        {/* choix faction */}
        <div>
          {factions.map((faction) => (
            <Button
              className="p-0 bg-transparent border-0 button-hover"
              onClick={() => {
                const index = activeFactions.indexOf(faction.slug);
                return setActiveFactions(
                  index === -1
                    ? activeFactions.concat(faction.slug)
                    : activeFactions.filter(
                        (factionSlug) => factionSlug !== faction.slug
                      )
                );
              }}
              title={faction.name}
              key={faction.name}
            >
              <FactionIcons faction={faction.slug} />
            </Button>
          ))}
        </div>

        {/* choix specs */}
        <div>
          {specs.map((spec) => {
            return (
              <Button
                className="p-0 bg-transparent border-0 button-hover"
                onClick={() => {
                  const index = activeSpecs.indexOf(spec.name);
                  return setActiveSpecs(
                    index === -1
                      ? activeSpecs.concat(spec.name)
                      : activeSpecs.filter((specName) => specName !== spec.name)
                  );
                }}
                title={spec.name}
                key={spec.name}
              >
                <img src={spec.image} alt={spec.name} title={spec.name} />
              </Button>
            );
          })}
        </div>
      </UncontrolledCollapse>
    </>
  );
}

ToolsFilters.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
  playerClass: PropTypes.string.isRequired,
};

export default ToolsFilters;
