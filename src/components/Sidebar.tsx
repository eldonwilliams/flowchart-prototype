import { ComponentPropsWithoutRef } from 'react';
import './Sidebar.css';

export interface SideBarProps extends ComponentPropsWithoutRef<"div"> {

}

export default function Sidebar(props: SideBarProps) {
    return (
        <div {...props} id="sidebar" >
            <div>Box</div>
            <div>Line</div>
            <div>Pointer</div>
        </div>
    )
}