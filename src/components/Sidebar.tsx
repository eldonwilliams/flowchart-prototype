import { ComponentPropsWithoutRef } from 'react';
import './Sidebar.css';
import { FlowchartSelectionState } from '../FlowchartComponents';

export interface SidebarClickEvent extends MouseEvent {
    selection: FlowchartSelectionState;
}

export interface SideBarProps extends ComponentPropsWithoutRef<"div"> {
    onSidebarClicked: (e: SidebarClickEvent) => void; 
}

export default function Sidebar(_props: SideBarProps) {
    const { onSidebarClicked, ...props } = _props;
    
    function handleClick(e: MouseEvent, selection: string) {
        const sidebarClickEvent: SidebarClickEvent = e as SidebarClickEvent;
        sidebarClickEvent.selection = selection as FlowchartSelectionState;
        onSidebarClicked(sidebarClickEvent);
    }

    return (
        <div {...props} id="sidebar" >
            <div onClick={(e: any) => handleClick(e, "box")}>Box</div>
            <div onClick={(e: any) => handleClick(e, "line")}>Line</div>
            <div onClick={(e: any) => handleClick(e, "pointer")}>Pointer</div>
        </div>
    )
}