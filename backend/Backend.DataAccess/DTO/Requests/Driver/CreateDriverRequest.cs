namespace Backend.DataAccess.DTO.Requests.Driver;

public class CreateDriverRequest
{
    public required string Name { get; set; }

    public required string LastName { get; set; }

    public required string Pathronymic { get; set; }

    public required string ContactData { get; set; }

    public required string CategoryDrive { get; set; }
}