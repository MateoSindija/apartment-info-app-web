import React, { useEffect, useRef } from 'react';
import { useDetectRef } from '@/hooks/useDetectRef';
import { useDisableBodyScroll } from '@/hooks/useDisableBodyScroll';

interface IProps {
    children: JSX.Element[] | JSX.Element;
    setIsModalOpen: (
        value: ((prevState: boolean) => boolean) | boolean
    ) => void;
    isModalOpen: boolean;
}

const Modal = ({ children, setIsModalOpen, isModalOpen }: IProps) => {
    const ref = useRef(null);
    useDisableBodyScroll(isModalOpen);

    useDetectRef(ref, () => {
        setIsModalOpen(false);
        useDisableBodyScroll(false);
    });

    return (
        isModalOpen && (
            <div className={'modal'}>
                <div className={'modal__content'} ref={ref}>
                    {children}
                </div>
            </div>
        )
    );
};

export default Modal;
