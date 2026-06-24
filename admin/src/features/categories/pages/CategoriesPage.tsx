import { PlusOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Form, Input, Modal, Select, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import type { Category, CreateCategoryInput } from '@/types/api'
import { useCategories, useCreateCategory } from '../hooks/useCategories'

interface CategoryFormValues {
  name: string
  slug?: string
  parentId?: number | null
}

export function CategoriesPage() {
  const [form] = Form.useForm<CategoryFormValues>()
  const [modalOpen, setModalOpen] = useState(false)
  const { data, isLoading, isError } = useCategories()
  const createCategory = useCreateCategory()

  const parentOptions = useMemo(
    () =>
      (data ?? []).map((category) => ({
        label: category.name,
        value: category.id,
      })),
    [data],
  )

  const parentNameById = useMemo(() => {
    const map = new Map<number, string>()
    for (const category of data ?? []) {
      map.set(category.id, category.name)
    }
    return map
  }, [data])

  const columns: ColumnsType<Category> = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Slug', dataIndex: 'slug' },
    {
      title: 'Parent',
      dataIndex: 'parentId',
      width: 180,
      render: (parentId: number | null) =>
        parentId ? (parentNameById.get(parentId) ?? `#${parentId}`) : '—',
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      width: 150,
      render: (value: string) => dayjs(value).format('MMM D, YYYY'),
    },
  ]

  const handleCreate = async () => {
    const values = await form.validateFields()
    const input: CreateCategoryInput = {
      name: values.name.trim(),
      slug: values.slug?.trim() || undefined,
      parentId: values.parentId ?? null,
    }

    createCategory.mutate(input, {
      onSuccess: () => {
        form.resetFields()
        setModalOpen(false)
      },
    })
  }

  return (
    <>
      <PageHeader
        title="Categories"
        subtitle="Organize your product catalog"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            Add category
          </Button>
        }
      />
      {isError ? (
        <Alert
          type="error"
          showIcon
          message="Could not load categories"
          description="Make sure the API is running and your account has the admin role."
        />
      ) : (
        <Card>
          <Table<Category>
            rowKey="id"
            loading={isLoading}
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}

      <Modal
        title="Add category"
        open={modalOpen}
        onCancel={() => {
          form.resetFields()
          setModalOpen(false)
        }}
        onOk={handleCreate}
        confirmLoading={createCategory.isPending}
        okText="Create"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input placeholder="Shoes" />
          </Form.Item>
          <Form.Item name="slug" label="Slug" extra="Leave blank to generate from the name">
            <Input placeholder="shoes" />
          </Form.Item>
          <Form.Item name="parentId" label="Parent category">
            <Select
              allowClear
              placeholder="None (top level)"
              options={parentOptions}
              disabled={parentOptions.length === 0}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
