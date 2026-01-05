import React from 'react'
import Link from 'next/link'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { FlaskConical, Calculator, MessageCircle, Code, ScrollText } from 'lucide-react'

const getIcon = (iconType: string) => {
    const iconProps = { size: 24, strokeWidth: 2 }
    switch (iconType) {
        case 'flask':
            return <FlaskConical {...iconProps} />
        case 'calculator':
            return <Calculator {...iconProps} />
        case 'message':
            return <MessageCircle {...iconProps} />
        case 'code':
            return <Code {...iconProps} />
        case 'scroll':
            return <ScrollText {...iconProps} />
        default:
            return <FlaskConical {...iconProps} />
    }
}

const CompanionList = ({ title, companions = [] }: CompanionListProps) => {
    return (
        <div className="companion-list-container">
            <h2 className="companion-list-title">{title}</h2>

            <Table>
                <TableHeader>
                    <TableRow className="companion-list-header-row">
                        <TableHead className="companion-list-header">Lessons</TableHead>
                        <TableHead className="companion-list-header">Subject</TableHead>
                        <TableHead className="companion-list-header text-right">Duration</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {companions.map(({ id, name, topic, subject, duration, icon, iconBg }) => (
                        <TableRow key={id} className="companion-list-row">
                            <TableCell className="companion-list-lesson-cell">
                                <Link href={`/companion/${id}`} className="companion-list-lesson">
                                    <div
                                        className="companion-list-icon"
                                        style={{ backgroundColor: iconBg }}
                                    >
                                        {getIcon(icon)}
                                    </div>
                                    <div className="companion-list-info">
                                        <div className="companion-list-name">{name}</div>
                                        <div className="companion-list-topic">Topic: {topic}</div>
                                    </div>
                                </Link>
                            </TableCell>
                            <TableCell className="companion-list-subject-cell">
                                <span className="companion-list-subject-badge">
                                    {subject}
                                </span>
                            </TableCell>
                            <TableCell className="companion-list-duration-cell text-right">
                                {duration}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default CompanionList