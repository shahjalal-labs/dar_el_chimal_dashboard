import * as React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { confirmable, ConfirmDialog, createConfirmation } from 'react-confirm';

export interface Props {
    okLabel?: string;
    cancelLabel?: string;
    title?: string;
    confirmation?: string;
}

const Confirmation: ConfirmDialog<Props, boolean> = (props) => (
    <div className='relative'>
        <Modal
            show={props.show}
            onHide={() => props.proceed(false)}
            backdrop="static"
            keyboard={false}
            animation={true}
            centered
            className="rounded-md shadow-lg bg-gray-100 absolute z-50 top-[20%] left-[50%] -translate-x-1/2 -translate-y-1/2 md:w-1/3 p-6"
        >
            {/* Header */}
            <Modal.Header closeButton className="border-b border-gray-200">
                <Modal.Title className="text-lg font-semibold text-gray-800 uppercase">
                    {props.title || 'Confirm'}
                </Modal.Title>
            </Modal.Header>

            {/* Body */}
            <Modal.Body className="py-6 px-4 text-center text-gray-700">
                {props.confirmation || 'Are you sure?'}
            </Modal.Body>

            {/* Footer */}
            <Modal.Footer className="border-t border-gray-200 flex justify-center gap-3 pt-4">
                <Button
                    variant="secondary"
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-lg px-4 py-2 font-medium"
                    onClick={() => props.proceed(false)}
                >
                    {props.cancelLabel || 'Cancel'}
                </Button>
                <Button
                    variant="primary"
                    className="bg-orange-500 hover:bg-orange-600 text-white border-none rounded-lg px-4 py-2 font-medium"
                    onClick={() => props.proceed(true)}
                >
                    {props.okLabel || 'OK'}
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
);

export const confirm = createConfirmation(confirmable(Confirmation));