import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Kanban, ArrowRight, Calendar, Tag, CheckCircle } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import Loader from '../components/Loader';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const columnsConfig = {
  'pending': {
    id: 'pending',
    title: 'Pending 📋',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.05)',
    border: 'rgba(245,158,11,0.2)'
  },
  'in-progress': {
    id: 'in-progress',
    title: 'In Progress ⚙️',
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.05)',
    border: 'rgba(6,182,212,0.2)'
  },
  'completed': {
    id: 'completed',
    title: 'Completed ✅',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.05)',
    border: 'rgba(16,185,129,0.2)'
  }
};

export default function KanbanPage() {
  const { tasks, loading, changeTaskStatus, fetchTasks } = useTask();
  const [boardData, setBoardData] = useState({
    pending: [],
    'in-progress': [],
    completed: []
  });

  // Re-group tasks when the context state changes
  useEffect(() => {
    const grouped = {
      pending: tasks.filter(t => t.status === 'pending'),
      'in-progress': tasks.filter(t => t.status === 'in-progress'),
      completed: tasks.filter(t => t.status === 'completed')
    };
    setBoardData(grouped);
  }, [tasks]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // Dropped outside a list
    if (!destination) return;

    // Dropped in the same column at the same index
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;

    // Optimistically update frontend state
    const sourceList = [...boardData[sourceColId]];
    const destList = sourceColId === destColId ? sourceList : [...boardData[destColId]];

    const [movedTask] = sourceList.splice(source.index, 1);
    const updatedTask = { ...movedTask, status: destColId };

    if (sourceColId === destColId) {
      sourceList.splice(destination.index, 0, updatedTask);
      setBoardData(prev => ({
        ...prev,
        [sourceColId]: sourceList
      }));
    } else {
      destList.splice(destination.index, 0, updatedTask);
      setBoardData(prev => ({
        ...prev,
        [sourceColId]: sourceList,
        [destColId]: destList
      }));
    }

    // Call backend API to persist state
    try {
      await changeTaskStatus(draggableId, destColId);
      toast.success(`Moved to ${destColId.charAt(0).toUpperCase() + destColId.slice(1)}`);
    } catch (err) {
      toast.error('Failed to move task. Reverting...');
      // Revert states
      fetchTasks();
    }
  };

  if (loading && tasks.length === 0) {
    return <Loader text="Loading your Kanban workspace..." />;
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-black text-white flex items-center gap-2">
          <Kanban className="text-primary" size={28} /> Kanban Board
        </h1>
        <p className="text-slate-400 mt-1">Drag and drop tasks between stages to track workflow status.</p>
      </div>

      {/* Board wrapper */}
      <div className="flex-1 overflow-x-auto min-h-[600px] pb-4 select-none">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full min-w-[900px] items-stretch">
            {Object.values(columnsConfig).map(col => {
              const colTasks = boardData[col.id] || [];
              return (
                <div
                  key={col.id}
                  className="flex-1 flex flex-col rounded-2xl p-4 min-h-[500px]"
                  style={{
                    background: 'rgba(30, 41, 59, 0.4)',
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${col.border}`
                  }}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                      <h2 className="font-bold text-sm text-white">{col.title}</h2>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Droppable Area */}
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 flex flex-col gap-3 rounded-xl transition-colors duration-200 p-1 ${
                          snapshot.isDraggingOver ? 'bg-slate-900/40 border border-dashed border-primary/25' : ''
                        }`}
                        style={{ minHeight: '400px' }}
                      >
                        {colTasks.map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(providedDrag, snapshotDrag) => (
                              <div
                                ref={providedDrag.innerRef}
                                {...providedDrag.draggableProps}
                                {...providedDrag.dragHandleProps}
                                className={`glass-card p-4 transition-shadow hover:shadow-lg ${
                                  snapshotDrag.isDragging ? 'rotate-2 border-primary/40 bg-slate-800/90 shadow-2xl' : ''
                                }`}
                                style={{
                                  ...providedDrag.draggableProps.style,
                                  borderLeft: `3px solid ${
                                    task.priority === 'urgent' ? '#DC2626' :
                                    task.priority === 'high' ? '#EF4444' :
                                    task.priority === 'medium' ? '#F59E0B' : '#10B981'
                                  }`
                                }}
                              >
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                                      {task.category || 'General'}
                                    </span>
                                    {task.priority && (
                                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                        task.priority === 'urgent' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                        task.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                                        task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-emerald-500/10 text-emerald-400'
                                      }`}>
                                        {task.priority}
                                      </span>
                                    )}
                                  </div>

                                  <h3 className="font-semibold text-sm text-slate-200 line-clamp-2">
                                    {task.title}
                                  </h3>

                                  {task.description && (
                                    <p className="text-xs text-slate-500 line-clamp-2">
                                      {task.description}
                                    </p>
                                  )}

                                  {/* Footer details */}
                                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                                    {task.dueDate ? (
                                      <span className="flex items-center gap-1">
                                        <Calendar size={11} /> {format(new Date(task.dueDate), 'MMM dd')}
                                      </span>
                                    ) : (
                                      <span />
                                    )}
                                    <span className="text-slate-600 font-medium">
                                      {task.comments?.length || 0} comments
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
