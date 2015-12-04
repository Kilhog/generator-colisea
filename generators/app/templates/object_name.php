  $object_name = new Base\ObjectName();
  $object_name->setName("%%0%%");
  $object_name->setTitle("%%0%%");
  $object_name->setDescription("%%0%%");
  $object_name->setModuleId($module_sample_object->getId());
  $em->persist($object_name);
