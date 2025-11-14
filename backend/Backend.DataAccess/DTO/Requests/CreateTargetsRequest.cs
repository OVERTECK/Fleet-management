namespace Backend.DataAccess.DTO.Requests;

public class CreateTargetsRequest
{
    public required string CarId { get; set; }

    public required Guid DriverId { get; set; }

    public required DateTime Start { get; set; }

    public required DateTime End { get; set; }
}