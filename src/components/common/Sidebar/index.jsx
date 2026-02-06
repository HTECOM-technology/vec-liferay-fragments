import React from "react";
import PropTypes from "prop-types";
import { SidebarContainer, SidebarItem, SidebarLabel } from "./style";

const Sidebar = ({ items, activeKey, onChange }) => {
    return (
        <SidebarContainer>
            {items.map((item) => (
                <SidebarItem
                    key={item.key}
                    $active={activeKey === item.key}
                    onClick={() => onChange(item.key)}
                >
                    {item.icon}
                    <SidebarLabel>{item.label}</SidebarLabel>
                </SidebarItem>
            ))}
        </SidebarContainer>
    );
};

Sidebar.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.node,
        })
    ).isRequired,
    activeKey: PropTypes.string,
    onChange: PropTypes.func,
};

export default Sidebar;
