import { faEnvelope, faInbox, faShareSquare } from "@fortawesome/free-solid-svg-icons";
import { faHistory } from "@fortawesome/free-solid-svg-icons/faHistory";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane";

export const PROCESS_NODE = "process_node";
export const COMPANY_NODE = "company";
export const PREFIX_COMPANY_NODE = "company_";
export const PREFIX_PROCESS_NODE = "process_";
export const PREFIX_PROCESS_NODE_ROOT = "process_root_";

export const PREFIX_ORGANIZATIONAL_UNID = "organizationalUnit_";
export const PREFIX_INBOX = "inbox_";
export const INBOX_NODE = "inbox";
export const ORGANIZATIONAL_UNIT_NODE = "organizationalUnitNode";
export const INBOX_ROUTE = "panel/inbox";

export const PREFIX_OUTPUT_BOX = "output_box_";
export const OUTPUT_BOX_NODE = "output_box";

export const SENT_SUBJECT_NODE = "sent_subject";
export const PREFIX_SENT_SUBJECT = "sent_subject_";

export const NEW_SUBJECT_NODE = "new_subject";
export const PREFIX_NEW_SUBJECT ="new_subject_";

export const PREFIX_NUEVO = "nuevo_";
export const PREFIX_AVANZADO = "avanzado_";
export const PREFIX_RESUELTO = "resuelto_";
export const PREFIX_REACTIVADO = "reactivado_";
export const PREFIX_FINALIZADO = "finalizado_";
export const PREFIX_HISTORICO = "historico_";

export const PREFIX_EXTERNO = "externo_";

/**
 * Mailbox constans are equal like backend
 */

export const NUEVO_CODE = "nuevo";
export const AVANZADO_CODE = "avanzado";

export const MAILBOX_CODES = [
    { code: NUEVO_CODE },
    { code: AVANZADO_CODE },
];

export const MAILBOX_INBOX_CODE = "inbox";
export const MAILBOX_INBOXOUT_CODE = "inboxout";

export function MailboxNodes(organizationalUnit) {
    const organizationalUnitId = organizationalUnit.id;

    return [
        {
            id: PREFIX_ORGANIZATIONAL_UNID + organizationalUnitId,
            name: organizationalUnit.name,
            nodeType: ORGANIZATIONAL_UNIT_NODE,
            icon: faInbox,
            isExpanded: true,
            organizationalUnitId: organizationalUnitId,
            children: [
                {
                    id: PREFIX_INBOX + organizationalUnitId,
                    name: 'Entrada internos',
                    nodeType: INBOX_NODE,
                    icon: faInbox,
                    isExpanded: true,
                    // route: ["panel/inbox"],
                    organizationalUnitId: organizationalUnitId,
                    children: [
                        {
                            id: PREFIX_INBOX + PREFIX_NUEVO + organizationalUnitId,
                            code: NUEVO_CODE,
                            mailboxType: MAILBOX_INBOX_CODE,
                            name: 'Nuevo',
                            nodeType: 'inbox_nuevo',
                            route: ["panel/mailbox/inbox/nuevo/" + organizationalUnitId],
                            icon: faEnvelope,
                            organizationalUnitId: organizationalUnitId,
                        }, {
                            id: PREFIX_INBOX + PREFIX_AVANZADO + organizationalUnitId,
                            code: AVANZADO_CODE,
                            mailboxType: MAILBOX_INBOX_CODE,
                            name: 'Avanzado',
                            nodeType: 'inbox_avanzado',
                            route: ["panel/mailbox/inbox/avanzado/" + + organizationalUnitId],
                            icon: faEnvelope,
                            organizationalUnitId: organizationalUnitId,
                        },
                        {
                            id: PREFIX_INBOX + PREFIX_RESUELTO + organizationalUnitId,
                            mailboxType: MAILBOX_INBOX_CODE,
                            code: '',
                            name: 'Resuelto',
                            nodeType: 'inbox_resuelto',
                            route: ["panel/mailbox/inbox/resuelto/" + organizationalUnitId],
                            icon: faEnvelope,
                            organizationalUnitId: organizationalUnitId,
                        },
                        {
                            id: PREFIX_INBOX + PREFIX_REACTIVADO + organizationalUnitId,
                            code: '',
                            mailboxType: MAILBOX_INBOX_CODE,
                            name: 'Reactivado',
                            nodeType: 'inbox_reactivado',
                            route: ["panel/mailbox/inbox/reactivado/" + organizationalUnitId],
                            icon: faEnvelope,
                            organizationalUnitId: organizationalUnitId,
                        },
                    ]
                },
                {
                    id: PREFIX_OUTPUT_BOX + organizationalUnitId,
                    name: 'Salida internos',
                    nodeType: OUTPUT_BOX_NODE,
                    icon: faShareSquare,
                    isExpanded: true,
                    // route: ["/panel/mailbox/inboxout"],
                    children: [
                        {
                            id: PREFIX_OUTPUT_BOX + PREFIX_NUEVO + organizationalUnitId,
                            name: 'Nuevo',
                            nodeType: 'inbox_nuevo',
                            route: ["panel/mailbox/inboxout/nuevo/" + organizationalUnitId],
                            icon: faEnvelope,
                            organizationalUnitId: organizationalUnitId,
                        },
                        {
                            id: PREFIX_OUTPUT_BOX + PREFIX_AVANZADO + organizationalUnitId,
                            name: 'Avanzado',
                            nodeType: 'inbox_avanzado',
                            route: ["panel/mailbox/inboxout/avanzado/" + organizationalUnitId],
                            icon: faEnvelope,
                            organizationalUnitId: organizationalUnitId,
                        },
                        {
                            id: PREFIX_OUTPUT_BOX + PREFIX_RESUELTO + organizationalUnitId,
                            name: 'Resuelto',
                            nodeType: 'inbox_resuelto',
                            route: ["panel/mailbox/inboxout/resuelto/" + organizationalUnitId],
                            icon: faEnvelope,
                            organizationalUnitId: organizationalUnitId,
                        },
                        {
                            id: PREFIX_OUTPUT_BOX + PREFIX_REACTIVADO + organizationalUnitId,
                            name: 'Reactivado',
                            nodeType: 'inbox_reactivado',
                            route: ["panel/mailbox/inboxout/reactivado/" + organizationalUnitId],
                            icon: faEnvelope,
                            organizationalUnitId: organizationalUnitId,
                        }

                    ]
                },
                {
                    id: PREFIX_HISTORICO + organizationalUnitId,
                    name: 'Histórico internos',
                    nodeType: OUTPUT_BOX_NODE,
                    icon: faHistory,
                    route: ["/panel/mailbox/mailboxHistorical/historico/" + organizationalUnitId],
                    children: [],
                    organizationalUnitId: organizationalUnitId,
                },
                {
                    id: PREFIX_INBOX + PREFIX_EXTERNO + organizationalUnitId,
                    name: 'Entrada externos',
                    nodeType: INBOX_NODE,
                    icon: faInbox,
                    isExpanded: true,
                    // route: ["panel/inbox"],
                    children: [
                        {
                            id: PREFIX_INBOX + PREFIX_EXTERNO + PREFIX_NUEVO + organizationalUnitId,
                            name: 'Nuevo',
                            nodeType: 'inbox_nuevo',
                            route: ["panel/mailbox/external/inbox/nuevo/" + organizationalUnitId],
                            icon: faEnvelope,
                            organizationalUnitId: organizationalUnitId,
                        },
                        {
                            id: PREFIX_INBOX + PREFIX_EXTERNO + PREFIX_AVANZADO + organizationalUnitId,
                            code: AVANZADO_CODE,
                            mailboxType: MAILBOX_INBOX_CODE,
                            name: 'Avanzado',
                            nodeType: 'inbox_avanzado',
                            route: ["panel/mailbox/external/inbox/avanzado/" + + organizationalUnitId],
                            icon: faEnvelope,
                            organizationalUnitId: organizationalUnitId,
                        },
                        {
                            id: PREFIX_INBOX + PREFIX_EXTERNO + PREFIX_RESUELTO + organizationalUnitId,
                            mailboxType: MAILBOX_INBOX_CODE,
                            code: '',
                            name: 'Resuelto',
                            nodeType: 'inbox_resuelto',
                            route: ["panel/mailbox/external/inbox/resuelto/" + organizationalUnitId],
                            icon: faEnvelope,
                            organizationalUnitId: organizationalUnitId,
                        },
                        {
                            id: PREFIX_INBOX + PREFIX_EXTERNO + PREFIX_REACTIVADO + organizationalUnitId,
                            code: '',
                            mailboxType: MAILBOX_INBOX_CODE,
                            name: 'Reactivado',
                            nodeType: 'inbox_reactivado',
                            route: ["panel/mailbox/external/inbox/reactivado/" + organizationalUnitId],
                            icon: faEnvelope,
                            organizationalUnitId: organizationalUnitId,
                        },
                    ]
                },
                {
                    id: PREFIX_OUTPUT_BOX + PREFIX_EXTERNO + organizationalUnitId,
                    name: 'Salida externos',
                    nodeType: OUTPUT_BOX_NODE,
                    icon: faShareSquare,
                    isExpanded: true,
                    // route: ["/panel/mailbox/inboxout"],
                    children: [
                        {
                            id: PREFIX_OUTPUT_BOX + PREFIX_EXTERNO + PREFIX_NUEVO + organizationalUnitId,
                            name: 'Nuevo',
                            nodeType: 'inbox_nuevo',
                            route: ["panel/mailbox/external/inboxout/nuevo/" + organizationalUnitId],
                            icon: faEnvelope,
                            organizationalUnitId: organizationalUnitId,
                        },
                        {
                            id: PREFIX_OUTPUT_BOX + PREFIX_EXTERNO + PREFIX_AVANZADO + organizationalUnitId,
                            name: 'Avanzado',
                            nodeType: 'inbox_avanzado',
                            route: ["panel/mailbox/external/inboxout/avanzado/" + organizationalUnitId],
                            icon: faEnvelope,
                            organizationalUnitId: organizationalUnitId,
                        },
                        {
                            id: PREFIX_OUTPUT_BOX + PREFIX_EXTERNO + PREFIX_RESUELTO + organizationalUnitId,
                            name: 'Resuelto',
                            nodeType: 'inbox_resuelto',
                            route: ["panel/mailbox/external/inboxout/resuelto/" + organizationalUnitId],
                            icon: faEnvelope,
                            organizationalUnitId: organizationalUnitId,
                        },
                        {
                            id: PREFIX_OUTPUT_BOX + PREFIX_EXTERNO + PREFIX_REACTIVADO + organizationalUnitId,
                            name: 'Reactivado',
                            nodeType: 'inbox_reactivado',
                            route: ["panel/mailbox/external/inboxout/reactivado/" + organizationalUnitId],
                            icon: faEnvelope,
                            organizationalUnitId: organizationalUnitId,
                        }

                    ]
                },
                {
                    id: PREFIX_HISTORICO + PREFIX_EXTERNO + organizationalUnitId,
                    name: 'Histórico Externos',
                    nodeType: OUTPUT_BOX_NODE,
                    icon: faHistory,
                    route: ["/panel/mailbox/external/mailboxHistorical/historico/" + organizationalUnitId],
                    children: [],
                    organizationalUnitId: organizationalUnitId,
                },
            ]
        }
    ];
}

export function PROCESS_ROOT_NODE(organizationalUnitId) {
    return {
        id: PREFIX_PROCESS_NODE_ROOT + organizationalUnitId,
        name: 'Emitir Asunto',
        children: [],
        icon: faPaperPlane,
        isExpanded: true,
    }

}

/**
 *
 * @param mailboxType
 * @param status
 */
export function getMailboxId(mailboxType: string, status: string): string {
    let mailboxId;

    switch(mailboxType) {
        case 'inbox':
            mailboxType = PREFIX_INBOX;
            break;
        case 'inboxout':
            mailboxType = PREFIX_OUTPUT_BOX;
            break;
        case 'mailboxExternal':
            mailboxType = PREFIX_EXTERNO;
            break;
    }


    switch (status) {
        case 'nuevo':
            mailboxId = mailboxType + PREFIX_NUEVO;
            break;
        case 'avanzado':
            mailboxId = mailboxType + PREFIX_AVANZADO;
            break;
        case 'resuelto':
            mailboxId = mailboxType + PREFIX_RESUELTO;
            break;
        case 'reactivado':
            mailboxId = mailboxType + PREFIX_REACTIVADO;
            break;
        case 'historico':
            mailboxId = PREFIX_HISTORICO;
            break;
        case 'finalizado':
            mailboxId = mailboxType + PREFIX_FINALIZADO;
            break;
    }

    return mailboxId;
}
