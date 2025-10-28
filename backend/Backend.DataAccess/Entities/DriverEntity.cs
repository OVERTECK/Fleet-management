namespace Backend.DataAccess.Entities;

public class DriverEntity
{
    public Guid Id { get; set; }

    public string Name { get; set; }

    public string LastName { get; set; }

    public string Pathronymic { get; set; }

    public string ContactData { get; set; }

    public string CategoryDrive { get; set; }
}