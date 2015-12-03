   );
  }

  public function fromArray(&$object, $data)
  {
    foreach (array_keys($data) as $d) {
      switch ($d) {