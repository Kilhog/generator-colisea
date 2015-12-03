
  $profile = $em->getRepository('Profile')->findBy(array('name' => "Administrateur"));

  $right = new Right();
  $right->setObjectName("%%0%%");
  $right->setModuleId($module_sample_object->getId());
  $right->setProfile($profile[0]);
  $right->setReadObj(true);
  $right->setWriteObj(true);
  $right->setMenuObj(true);
  $right->setDeleteObj(true);
  $right->setCreateObj(true);
  $em->persist($right);

  $em->flush();