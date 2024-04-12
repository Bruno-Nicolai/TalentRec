import { DragOverlay, UseDraggableArguments, useDraggable } from '@dnd-kit/core'

interface Props {
    id: string;
    data?: UseDraggableArguments['data'];
}

const KanbanItem = ({ children, id, data }: React.PropsWithChildren<Props>) => {
    const { 
        attributes, 
        listeners, 
        setNodeRef, 
        active 
    } = useDraggable({
        id,
        data,
    }) /* 04:22:32 */
  return (
    <div
        style={{
            position: 'relative',
        }}
    >
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{
                opacity: active ? (active.id === id ? 1 : 0.5) : 1,
                position: 'relative',
                padding: '12px',
                borderRadius: '8px',
                borderColor: active ? '#000040' : 'transparent',
                cursor: 'grab',
                userSelect: 'none',
                backgroundColor: '#fed6a9',
            }}
        >
            {active?.id === id && (
                <DragOverlay zIndex={1000}>
                    <div
                        style={{
                            borderRadius: '8px',
                            boxShadow: 'rgba(149, 157, 165, .2) 0px 8px 24px',
                            cursor: 'grabbing',
                        }}
                    >{children}</div>
                </DragOverlay>
            )}
            {children}
        </div>
    </div>
  )
}

export default KanbanItem